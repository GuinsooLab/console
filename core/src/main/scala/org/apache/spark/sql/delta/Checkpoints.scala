/*
 * Copyright (2021) The Delta Lake Project Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.spark.sql.delta

import java.io.FileNotFoundException
import java.util.UUID

import scala.collection.mutable
import scala.collection.mutable.ArrayBuffer
import scala.math.Ordering.Implicits._
import scala.util.control.NonFatal

// scalastyle:off import.ordering.noEmptyLine
import org.apache.spark.sql.delta.actions.{Metadata, SingleAction}
import org.apache.spark.sql.delta.metering.DeltaLogging
import org.apache.spark.sql.delta.sources.DeltaSQLConf
import org.apache.spark.sql.delta.storage.LogStore
import org.apache.spark.sql.delta.util.DeltaFileOperations
import org.apache.spark.sql.delta.util.FileNames._
import org.apache.spark.sql.delta.util.JsonUtils
import com.fasterxml.jackson.annotation.JsonPropertyOrder
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.node.ObjectNode
import org.apache.commons.codec.digest.DigestUtils
import org.apache.hadoop.conf.Configuration
import org.apache.hadoop.fs.Path
import org.apache.hadoop.mapred.{JobConf, TaskAttemptContextImpl, TaskAttemptID}
import org.apache.hadoop.mapreduce.{Job, TaskType}

import org.apache.spark.sql.{Column, DataFrame, SparkSession}
import org.apache.spark.sql.catalyst.analysis.UnresolvedAttribute
import org.apache.spark.sql.catalyst.expressions.{Cast, ElementAt, Literal}
import org.apache.spark.sql.execution.datasources.parquet.ParquetFileFormat
import org.apache.spark.sql.functions.{coalesce, col, struct, when}
import org.apache.spark.sql.internal.SQLConf
import org.apache.spark.sql.types.StructType
import org.apache.spark.util.SerializableConfiguration
import org.apache.spark.util.Utils

/**
 * Records information about a checkpoint.
 *
 * This class provides the checksum validation logic, needed to ensure that content of
 * LAST_CHECKPOINT file points to a valid json. The readers might read some part from old file and
 * some part from the new file (if the file is read across multiple requests). In some rare
 * scenarios, the split read might produce a valid json and readers will be able to parse it and
 * convert it into a [[CheckpointMetaData]] object that contains invalid data. In order to prevent
 * using it, we do a checksum match on the read json to validate that it is consistent.
 *
 * For old Delta versions, which do not have checksum logic, we want to make sure that the old
 * fields (i.e. version, size, parts) are together in the beginning of last_checkpoint json. All
 * these fields together are less than 50 bytes, so even in split read scenario, we want to make
 * sure that old delta readers which do not do have checksum validation logic, gets all 3 fields
 * from one read request. For this reason, we use `JsonPropertyOrder` to force them in the beginning
 * together.
 *
 * @param version the version of this checkpoint
 * @param size the number of actions in the checkpoint, -1 if the information is unavailable.
 * @param parts the number of parts when the checkpoint has multiple parts. None if this is a
 *              singular checkpoint
 * @param sizeInBytes the number of bytes of the checkpoint
 * @param numOfAddFiles the number of AddFile actions in the checkpoint
 * @param checkpointSchema the schema of the underlying checkpoint files
 * @param checksum the checksum of the [[CheckpointMetaData]].
 */
@JsonPropertyOrder(Array("version", "size", "parts"))
case class CheckpointMetaData(
    version: Long,
    size: Long,
    parts: Option[Int],
    @JsonDeserialize(contentAs = classOf[java.lang.Long])
    sizeInBytes: Option[Long],
    @JsonDeserialize(contentAs = classOf[java.lang.Long])
    numOfAddFiles: Option[Long],
    checkpointSchema: Option[StructType],
    checksum: Option[String] = None)

object CheckpointMetaData {

  val STORED_CHECKSUM_KEY = "checksum"

  /**
   * Returns the json representation of this [[CheckpointMetaData]] object.
   * Also adds the checksum to the returned json if `addChecksum` is set. The checksum can be
   * used by readers to validate consistency of the [[CheckpointMetadata]].
   * It is calculated using rules mentioned in "JSON checksum" section in PROTOCOL.md.
   */
  def serializeToJson(chkMetadata: CheckpointMetaData, addChecksum: Boolean): String = {
    val jsonStr: String = JsonUtils.toJson(chkMetadata.copy(checksum = None))
    if (!addChecksum) return jsonStr
    val rootNode = JsonUtils.mapper.readValue(jsonStr, classOf[ObjectNode])
    val checksum = treeNodeToChecksum(rootNode)
    rootNode.put(STORED_CHECKSUM_KEY, checksum).toString
  }

  /**
   * Converts the given `jsonStr` into a [[CheckpointMetaData]] object.
   * if `validate` is set, then it also validates the consistency of the json:
   *  - calculating the checksum and comparing it with the `storedChecksum`.
   *  - json should not have any duplicates.
   */
  def deserializeFromJson(jsonStr: String, validate: Boolean): CheckpointMetaData = {
    if (validate) {
      val (storedChecksumOpt, actualChecksum) = CheckpointMetaData.getChecksums(jsonStr)
      storedChecksumOpt.filter(_ != actualChecksum).foreach { storedChecksum =>
        throw new IllegalStateException(s"Checksum validation failed for json: $jsonStr,\n" +
          s"storedChecksum:$storedChecksum, actualChecksum:$actualChecksum")
      }
    }

    // This means:
    // 1) EITHER: Checksum validation is config-disabled
    // 2) OR: The json lacked a checksum (e.g. written by old client). Nothing to validate.
    // 3) OR: The Stored checksum matches the calculated one. Validation succeeded.
    JsonUtils.fromJson[CheckpointMetaData](jsonStr)
  }

  /**
   * Analyzes the json representation of [[CheckpointMetaData]] and returns checksum tuple where
   * - first element refers to the stored checksum in the json representation of
   *   [[CheckpointMetaData]], None if the checksum is not present.
   * - second element refers to the checksum computed from the canonicalized json representation of
   *   the [[CheckpointMetaData]].
   */
  def getChecksums(jsonStr: String): (Option[String], String) = {
    val reader =
      JsonUtils.mapper.reader().withFeatures(DeserializationFeature.FAIL_ON_READING_DUP_TREE_KEY)
    val rootNode = reader.readTree(jsonStr)
    val storedChecksum = if (rootNode.has(STORED_CHECKSUM_KEY)) {
        Some(rootNode.get(STORED_CHECKSUM_KEY).asText())
      } else {
        None
      }
    val actualChecksum = treeNodeToChecksum(rootNode)
    storedChecksum -> actualChecksum
  }

  /**
   * Canonicalizes the given `treeNode` json and returns its md5 checksum.
   * Refer to "JSON checksum" section in PROTOCOL.md for canonicalization steps.
   */
  def treeNodeToChecksum(treeNode: JsonNode): String = {
    val jsonEntriesBuffer = ArrayBuffer.empty[(String, String)]

    import scala.collection.JavaConverters._
    def traverseJsonNode(currentNode: JsonNode, prefix: ArrayBuffer[String]): Unit = {
      if (currentNode.isObject) {
        currentNode.fields().asScala.foreach { entry =>
          prefix.append(encodeString(entry.getKey))
          traverseJsonNode(entry.getValue, prefix)
          prefix.trimEnd(1)
        }
      } else if (currentNode.isArray) {
        currentNode.asScala.zipWithIndex.foreach { case (jsonNode, index) =>
          prefix.append(index.toString)
          traverseJsonNode(jsonNode, prefix)
          prefix.trimEnd(1)
        }
      } else {
        var nodeValue = currentNode.asText()
        if (currentNode.isTextual) nodeValue = encodeString(nodeValue)
        jsonEntriesBuffer.append(prefix.mkString("+") -> nodeValue)
      }
    }
    traverseJsonNode(treeNode, prefix = ArrayBuffer.empty)
    import Ordering.Implicits._
    val normalizedJsonKeyValues = jsonEntriesBuffer
      .filter { case (k, _) => k != s""""$STORED_CHECKSUM_KEY"""" }
      .map { case (k, v) => s"$k=$v" }
      .sortBy(_.toSeq: Seq[Char])
      .mkString(",")
    DigestUtils.md5Hex(normalizedJsonKeyValues)
  }

  private val isUnreservedOctet =
    (Set.empty ++ ('a' to 'z') ++ ('A' to 'Z') ++ ('0' to '9') ++ "-._~").map(_.toByte)

  /**
   * URL encodes a String based on the following rules:
   * 1. Use uppercase hexadecimals for all percent encodings
   * 2. percent-encode everything other than unreserved characters
   * 3. unreserved characters are = a-z / A-Z / 0-9 / "-" / "." / "_" / "~"
   */
  private def encodeString(str: String): String = {
    val result = str.getBytes(java.nio.charset.StandardCharsets.UTF_8).map {
      case b if isUnreservedOctet(b) => b.toChar.toString
      case b =>
        // convert to char equivalent of unsigned byte
        val c = (b & 0xff)
        f"%%$c%02X"
    }.mkString
    s""""$result""""
  }

  def fromLogSegment(segment: LogSegment): Option[CheckpointMetaData] = {
    segment.checkpointVersionOpt.map { version =>
      CheckpointMetaData(
        version = version,
        size = -1L,
        parts = numCheckpointParts(segment.checkpoint.head.getPath),
        sizeInBytes = None,
        numOfAddFiles = None,
        checkpointSchema = None
      )
    }
  }
}

/**
 * A class to help with comparing checkpoints with each other, where we may have had concurrent
 * writers that checkpoint with different number of parts.
 */
case class CheckpointInstance(
    version: Long,
    numParts: Option[Int]) extends Ordered[CheckpointInstance] {
  /**
   * Due to lexicographic sorting, a version with more parts will appear after a version with
   * less parts during file listing. We use that logic here as well.
   */
  def isEarlierThan(other: CheckpointInstance): Boolean = {
    if (other == CheckpointInstance.MaxValue) return true
    // numParts is set to None if the checkpoint is made up of a single
    // file ($version%020d.checkpoint.parquet). None < Some(x) for all x, which means
    // we'll break ties in favor of multi-part checkpoints (because they appear "larger").
    (version, numParts) < (other.version, other.numParts)
  }

  def isNotLaterThan(other: CheckpointInstance): Boolean = {
    if (other == CheckpointInstance.MaxValue) return true
    version <= other.version
  }

  def getCorrespondingFiles(path: Path): Seq[Path] = {
    assert(this != CheckpointInstance.MaxValue, "Can't get files for CheckpointVersion.MaxValue.")
    numParts match {
      case None => checkpointFileSingular(path, version) :: Nil
      case Some(parts) => checkpointFileWithParts(path, version, parts)
    }
  }

  override def compare(that: CheckpointInstance): Int = {
    if (version == that.version) {
      numParts.getOrElse(1) - that.numParts.getOrElse(1)
    } else {
      // we need to guard against overflow. We just can't return (this - that).toInt
      if (version - that.version < 0) -1 else 1
    }
  }
}

object CheckpointInstance {
  def apply(path: Path): CheckpointInstance = {
    CheckpointInstance(checkpointVersion(path), numCheckpointParts(path))
  }

  def apply(metadata: CheckpointMetaData): CheckpointInstance = {
    CheckpointInstance(metadata.version, metadata.parts)
  }

  val MaxValue: CheckpointInstance = CheckpointInstance(-1, None)
}

trait Checkpoints extends DeltaLogging {
  self: DeltaLog =>

  def logPath: Path
  def dataPath: Path
  def snapshot: Snapshot
  protected def store: LogStore
  protected def metadata: Metadata

  /** Used to clean up stale log files. */
  protected def doLogCleanup(): Unit

  /** Returns the checkpoint interval for this log. Not transactional. */
  def checkpointInterval: Int = DeltaConfigs.CHECKPOINT_INTERVAL.fromMetaData(metadata)

  /** The path to the file that holds metadata about the most recent checkpoint. */
  val LAST_CHECKPOINT = new Path(logPath, "_last_checkpoint")

  /**
   * Creates a checkpoint using the default snapshot.
   */
  def checkpoint(): Unit = checkpoint(snapshot)

  /**
   * Creates a checkpoint using snapshotToCheckpoint. By default it uses the current log version.
   * Note that this function captures and logs all exceptions, since the checkpoint shouldn't fail
   * the overall commit operation.
   */
  def checkpoint(snapshotToCheckpoint: Snapshot): Unit = withDmqTag {
    recordDeltaOperation(this, "delta.checkpoint") {
      try {
        if (snapshotToCheckpoint.version < 0) {
          throw DeltaErrors.checkpointNonExistTable(dataPath)
        }
        checkpointAndCleanUpDeltaLog(snapshotToCheckpoint)
      } catch {
        // Catch all non-fatal exceptions, since the checkpoint is written after the commit
        // has completed. From the perspective of the user, the commit completed successfully.
        // However, throw if this is in a testing environment - that way any breaking changes
        // can be caught in unit tests.
        case NonFatal(e) =>
          recordDeltaEvent(
            snapshotToCheckpoint.deltaLog,
            "delta.checkpoint.sync.error",
            data = Map(
              "exception" -> e.getMessage(),
              "stackTrace" -> e.getStackTrace()
            )
          )
          logWarning(s"Error when writing checkpoint synchronously", e)
          val throwError = Utils.isTesting ||
            spark.sessionState.conf.getConf(
              DeltaSQLConf.DELTA_CHECKPOINT_THROW_EXCEPTION_WHEN_FAILED)
          if (throwError) {
            throw e
          }
      }
    }
  }

  protected def checkpointAndCleanUpDeltaLog(
      snapshotToCheckpoint: Snapshot): Unit = {
    val lastCheckpointChecksumEnabled = spark.sessionState.conf.getConf(
      DeltaSQLConf.LAST_CHECKPOINT_CHECKSUM_ENABLED)

    val checkpointMetaData = writeCheckpointFiles(snapshotToCheckpoint)
    val json = CheckpointMetaData.serializeToJson(checkpointMetaData, lastCheckpointChecksumEnabled)
    store.write(LAST_CHECKPOINT, Iterator(json), overwrite = true, newDeltaHadoopConf())
    doLogCleanup()
  }

  protected def writeCheckpointFiles(snapshotToCheckpoint: Snapshot): CheckpointMetaData = {
    Checkpoints.writeCheckpoint(spark, this, snapshotToCheckpoint)
  }

  /** Returns information about the most recent checkpoint. */
  private[delta] def lastCheckpoint: Option[CheckpointMetaData] = {
    loadMetadataFromFile(0)
  }

  /** Loads the checkpoint metadata from the _last_checkpoint file. */
  private def loadMetadataFromFile(tries: Int): Option[CheckpointMetaData] = withDmqTag {
    recordFrameProfile("Delta", "Checkpoints.loadMetadataFromFile") {
      try {
        val checkpointMetadataJson = store.read(LAST_CHECKPOINT, newDeltaHadoopConf())
        val validate = spark.sessionState.conf.getConf(
          DeltaSQLConf.LAST_CHECKPOINT_CHECKSUM_ENABLED)
        Some(CheckpointMetaData.deserializeFromJson(checkpointMetadataJson.head, validate))
      } catch {
        case _: FileNotFoundException =>
          None
        case NonFatal(e) if tries < 3 =>
          logWarning(s"Failed to parse $LAST_CHECKPOINT. This may happen if there was an error " +
            "during read operation, or a file appears to be partial. Sleeping and trying again.", e)
          Thread.sleep(1000)
          loadMetadataFromFile(tries + 1)
        case NonFatal(e) =>
          recordDeltaEvent(
            self,
            "delta.lastCheckpoint.read.corruptedJson",
            data = Map("exception" -> Utils.exceptionString(e))
          )

          logWarning(s"$LAST_CHECKPOINT is corrupted. Will search the checkpoint files directly", e)
          // Hit a partial file. This could happen on Azure as overwriting _last_checkpoint file is
          // not atomic. We will try to list all files to find the latest checkpoint and restore
          // CheckpointMetaData from it.
          val verifiedCheckpoint = findLastCompleteCheckpoint(CheckpointInstance(-1L, None))
          verifiedCheckpoint.map(manuallyLoadCheckpoint)
      }
    }
  }

  /** Loads the given checkpoint manually to come up with the CheckpointMetaData */
  protected def manuallyLoadCheckpoint(cv: CheckpointInstance): CheckpointMetaData = {
    CheckpointMetaData(
      version = cv.version,
      size = -1,
      parts = cv.numParts,
      sizeInBytes = None,
      numOfAddFiles = None,
      checkpointSchema = None)
  }

  /**
   * Finds the first verified, complete checkpoint before the given version.
   *
   * @param cv The CheckpointVersion to compare against
   */
  protected def findLastCompleteCheckpoint(cv: CheckpointInstance): Option[CheckpointInstance] = {
    var cur = math.max(cv.version, 0L)
    val startVersion = cur
    val hadoopConf = newDeltaHadoopConf()

    logInfo(s"Try to find Delta last complete checkpoint before version $startVersion")
    while (cur >= 0) {
      val checkpoints = store.listFrom(
            checkpointPrefix(logPath, math.max(0, cur - 1000)),
            hadoopConf)
          // Checkpoint files of 0 size are invalid but Spark will ignore them silently when reading
          // such files, hence we drop them so that we never pick up such checkpoints.
          .filter { file => isCheckpointFile(file.getPath) && file.getLen != 0 }
          .map{ file => CheckpointInstance(file.getPath) }
          .takeWhile(tv => (cur == 0 || tv.version <= cur) && tv.isEarlierThan(cv))
          .toArray
      val lastCheckpoint = getLatestCompleteCheckpointFromList(checkpoints, cv)
      if (lastCheckpoint.isDefined) {
        logInfo(s"Delta checkpoint is found at version ${lastCheckpoint.get.version}")
        return lastCheckpoint
      } else {
        cur -= 1000
      }
    }
    logInfo(s"No checkpoint found for Delta table before version $startVersion")
    None
  }

  /**
   * Given a list of checkpoint files, pick the latest complete checkpoint instance which is not
   * later than `notLaterThan`.
   */
  protected def getLatestCompleteCheckpointFromList(
      instances: Array[CheckpointInstance],
      notLaterThan: CheckpointInstance): Option[CheckpointInstance] = {
    val complete = instances.filter(_.isNotLaterThan(notLaterThan)).groupBy(identity).filter {
      case (CheckpointInstance(_, None), inst) => inst.length == 1
      case (CheckpointInstance(_, Some(parts)), inst) => inst.length == parts
    }
    if (complete.isEmpty) None else Some(complete.keys.max)
  }
}

object Checkpoints extends DeltaLogging {

  /**
   * Returns the checkpoint schema that should be written to the last checkpoint file based on
   * [[DeltaSQLConf.CHECKPOINT_SCHEMA_WRITE_THRESHOLD_LENGTH]] conf.
   */
  private[delta] def checkpointSchemaToWriteInLastCheckpointFile(
      spark: SparkSession,
      schema: StructType): Option[StructType] = {
    val checkpointSchemaSizeThreshold = spark.sessionState.conf.getConf(
      DeltaSQLConf.CHECKPOINT_SCHEMA_WRITE_THRESHOLD_LENGTH)
    Some(schema).filter(s => JsonUtils.toJson(s).length <= checkpointSchemaSizeThreshold)
  }

  /**
   * Writes out the contents of a [[Snapshot]] into a checkpoint file that
   * can be used to short-circuit future replays of the log.
   *
   * Returns the checkpoint metadata to be committed to a file. We will use the value
   * in this file as the source of truth of the last valid checkpoint.
   */
  private[delta] def writeCheckpoint(
      spark: SparkSession,
      deltaLog: DeltaLog,
      snapshot: Snapshot): CheckpointMetaData = withDmqTag {
    import SingleAction._

    val hadoopConf = deltaLog.newDeltaHadoopConf()

    // The writing of checkpoints doesn't go through log store, so we need to check with the
    // log store and decide whether to use rename.
    val useRename = deltaLog.store.isPartialWriteVisible(deltaLog.logPath, hadoopConf)

    val checkpointRowCount = spark.sparkContext.longAccumulator("checkpointRowCount")
    val numOfFiles = spark.sparkContext.longAccumulator("numOfFiles")

    val sessionConf = spark.sessionState.conf
    val checkpointPartSize =
        sessionConf.getConf(DeltaSQLConf.DELTA_CHECKPOINT_PART_SIZE)

    val numParts = checkpointPartSize.map { partSize =>
      math.ceil((snapshot.numOfFiles + snapshot.numOfRemoves).toDouble / partSize).toLong
    }.getOrElse(1L)

    val checkpointPaths = if (numParts > 1) {
      checkpointFileWithParts(snapshot.path, snapshot.version, numParts.toInt)
    } else {
      checkpointFileSingular(snapshot.path, snapshot.version) :: Nil
    }

    val numPartsOption = if (numParts > 1) {
      Some(checkpointPaths.length)
    } else {
      None
    }

    // Use the string in the closure as Path is not Serializable.
    val paths = checkpointPaths.map(_.toString)
    val base = snapshot.stateDS
      .repartition(paths.length, coalesce(col("add.path"), col("remove.path")))
      .map { action =>
        if (action.add != null) {
          numOfFiles.add(1)
        }
        action
      }
      .drop("commitInfo", "cdc")

    val chk = buildCheckpoint(base, snapshot)
    val schema = chk.schema.asNullable

    val (factory, serConf) = {
      val format = new ParquetFileFormat()
      val job = Job.getInstance(hadoopConf)
      (format.prepareWrite(spark, job, Map.empty, schema),
        new SerializableConfiguration(job.getConfiguration))
    }

    val checkpointSizeInBytes = spark.sparkContext.longAccumulator("checkpointSizeInBytes")

    val writtenPaths = chk
      .queryExecution // This is a hack to get spark to write directly to a file.
      .executedPlan
      .execute()
      .mapPartitionsWithIndex { case (index, iter) =>
        val path = paths(index)
        val writtenPath =
          if (useRename) {
            val p = new Path(path)
            // Two instances of the same task may run at the same time in some cases (e.g.,
            // speculation, stage retry), so generate the temp path here to avoid two tasks
            // using the same path.
            val tempPath = new Path(p.getParent, s".${p.getName}.${UUID.randomUUID}.tmp")
            DeltaFileOperations.registerTempFileDeletionTaskFailureListener(serConf.value, tempPath)
            tempPath.toString
          } else {
            path
          }
        val writeAction = () => {
          try {
            val writer = factory.newInstance(
              writtenPath,
              schema,
              new TaskAttemptContextImpl(
                new JobConf(serConf.value),
                new TaskAttemptID("", 0, TaskType.REDUCE, 0, 0)))

            iter.foreach { row =>
              checkpointRowCount.add(1)
              writer.write(row)
            }
            // Note: `writer.close()` is not put in a `finally` clause because we don't want to
            // close it when an exception happens. Closing the file would flush the content to the
            // storage and create an incomplete file. A concurrent reader might see it and fail.
            // This would leak resources but we don't have a way to abort the storage request here.
            writer.close()

            val filePath = new Path(writtenPath)
            val stat = filePath.getFileSystem(serConf.value).getFileStatus(filePath)
            checkpointSizeInBytes.add(stat.getLen)
          } catch {
            case e: org.apache.hadoop.fs.FileAlreadyExistsException if !useRename =>
              val p = new Path(writtenPath)
              if (p.getFileSystem(serConf.value).exists(p)) {
                // The file has been written by a zombie task. We can just use this checkpoint file
                // rather than failing a Delta commit.
              } else {
                throw e
              }
          }
        }
        if (isGCSPath(serConf.value, new Path(writtenPath))) {
          // GCS may upload an incomplete file when the current thread is interrupted, hence we move
          // the write to a new thread so that the write cannot be interrupted.
          // TODO Remove this hack when the GCS Hadoop connector fixes the issue.
          DeltaFileOperations.runInNewThread("delta-gcs-checkpoint-write") {
            writeAction()
          }
        } else {
          writeAction()
        }
        Iterator(writtenPath)
      }.collect()

    if (useRename) {
      var renameDone = false
      val fs = snapshot.path.getFileSystem(hadoopConf)
      try {
        writtenPaths.zipWithIndex.foreach { case (writtenPath, index) =>
          val src = new Path(writtenPath)
          val dest = new Path(paths(index))
          if (!fs.rename(src, dest)) {
            throw DeltaErrors.failOnCheckpoint(src, dest)
          }
        }
        renameDone = true
      } finally {
        if (!renameDone) {
          writtenPaths.foreach { writtenPath =>
            scala.util.Try {
              val src = new Path(writtenPath)
              fs.delete(src, false)
            }
          }
        }
      }
    }

    if (numOfFiles.value != snapshot.numOfFiles) {
      throw DeltaErrors.checkpointMismatchWithSnapshot
    }

    // Attempting to write empty checkpoint
    if (checkpointRowCount.value == 0) {
      logWarning(DeltaErrors.EmptyCheckpointErrorMessage)
    }
    CheckpointMetaData(
      version = snapshot.version,
      size = checkpointRowCount.value,
      parts = numPartsOption,
      sizeInBytes = Some(checkpointSizeInBytes.value),
      numOfAddFiles = Some(snapshot.numOfFiles),
      checkpointSchema = checkpointSchemaToWriteInLastCheckpointFile(spark, schema))
  }

  // scalastyle:off line.size.limit
  /**
   * All GCS paths can only have the scheme of "gs". Note: the scheme checking is case insensitive.
   * See:
   * - https://github.com/databricks/hadoop-connectors/blob/master/gcs/src/main/java/com/google/cloud/hadoop/fs/gcs/GoogleHadoopFileSystemBase.java#L493
   * - https://github.com/GoogleCloudDataproc/hadoop-connectors/blob/v2.2.3/gcsio/src/main/java/com/google/cloud/hadoop/gcsio/GoogleCloudStorageFileSystem.java#L88
   */
  // scalastyle:on line.size.limit
  private[delta] def isGCSPath(hadoopConf: Configuration, path: Path): Boolean = {
    val scheme = path.toUri.getScheme
    if (scheme != null) {
      scheme.equalsIgnoreCase("gs")
    } else {
      // When the schema is not available in the path, we check the file system scheme resolved from
      // the path.
      path.getFileSystem(hadoopConf).getScheme.equalsIgnoreCase("gs")
    }
  }

  /**
   * Modify the contents of the add column based on the table properties
   */
  private[delta] def buildCheckpoint(state: DataFrame, snapshot: Snapshot): DataFrame = {
    val additionalCols = new mutable.ArrayBuffer[Column]()
    val sessionConf = state.sparkSession.sessionState.conf
    if (DeltaConfigs.CHECKPOINT_WRITE_STATS_AS_JSON.fromMetaData(snapshot.metadata)) {
      additionalCols += col("add.stats").as("stats")
    }
    // We provide fine grained control using the session conf for now, until users explicitly
    // opt in our out of the struct conf.
    val includeStructColumns = getWriteStatsAsStructConf(sessionConf, snapshot)
    if (includeStructColumns) {
      additionalCols ++= CheckpointV2.extractPartitionValues(snapshot.metadata.partitionSchema)
    }
    state.withColumn("add",
      when(col("add").isNotNull, struct(Seq(
        col("add.path"),
        col("add.partitionValues"),
        col("add.size"),
        col("add.modificationTime"),
        col("add.dataChange"), // actually not really useful here
        col("add.tags")) ++
        additionalCols: _*
      ))
    )
  }

  def getWriteStatsAsStructConf(conf: SQLConf, snapshot: Snapshot): Boolean = {
    DeltaConfigs.CHECKPOINT_WRITE_STATS_AS_STRUCT
      .fromMetaData(snapshot.metadata)
      .getOrElse(conf.getConf(DeltaSQLConf.DELTA_CHECKPOINT_V2_ENABLED))
  }
}

/**
 * Utility methods for generating and using V2 checkpoints. V2 checkpoints have partition values and
 * statistics as struct fields of the `add` column.
 */
object CheckpointV2 {
  val PARTITIONS_COL_NAME = "partitionValues_parsed"
  val STATS_COL_NAME = "stats_parsed"

  /**
   * Creates a nested struct column of partition values that extract the partition values
   * from the original MapType.
   */
  def extractPartitionValues(partitionSchema: StructType): Option[Column] = {
    val partitionValues = partitionSchema.map { field =>
      val physicalName = DeltaColumnMapping.getPhysicalName(field)
      new Column(Cast(
        ElementAt(
          UnresolvedAttribute("add" :: "partitionValues" :: Nil),
          Literal(physicalName),
          failOnError = false),
        field.dataType,
        ansiEnabled = false)
      ).as(physicalName)
    }
    if (partitionValues.isEmpty) None else Some(struct(partitionValues: _*).as(PARTITIONS_COL_NAME))
  }
}
