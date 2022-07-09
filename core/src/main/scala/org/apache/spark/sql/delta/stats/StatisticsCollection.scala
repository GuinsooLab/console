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

package org.apache.spark.sql.delta.stats

// scalastyle:off import.ordering.noEmptyLine
import scala.collection.mutable.ArrayBuffer

import org.apache.spark.sql.delta.{DeltaColumnMapping, DeltaLog, DeltaUDF}
import org.apache.spark.sql.delta.DeltaOperations.ComputeStats
import org.apache.spark.sql.delta.actions.AddFile
import org.apache.spark.sql.delta.commands.DeltaCommand
import org.apache.spark.sql.delta.metering.DeltaLogging
import org.apache.spark.sql.delta.sources.DeltaSQLConf

import org.apache.spark.sql._
import org.apache.spark.sql.catalyst.analysis.UnresolvedAttribute
import org.apache.spark.sql.catalyst.expressions._
import org.apache.spark.sql.catalyst.plans.logical.LocalRelation
import org.apache.spark.sql.functions._
import org.apache.spark.sql.types._

/**
 * Used to report metrics on how predicates are used to prune the set of
 * files that are read by a query.
 *
 * @param predicate         A user readable version of the predicate.
 * @param pruningType       One of {partition, dataStats, none}.
 * @param filesMissingStats The number of files that were included due to missing statistics.
 * @param filesDropped      The number of files that were dropped by this predicate.
 */
case class QueryPredicateReport(
    predicate: String,
    pruningType: String,
    filesMissingStats: Long,
    filesDropped: Long)

/** Used to report details about prequery filtering of what data is scanned. */
case class FilterMetric(numFiles: Long, predicates: Seq[QueryPredicateReport])

/**
 * A helper trait that constructs expressions that can be used to collect global
 * and column level statistics for a collection of data, given its schema.
 *
 * Global statistics (such as the number of records) are stored as top level columns.
 * Per-column statistics (such as min/max) are stored in a struct that mirrors the
 * schema of the data.
 *
 * To illustrate, here is an example of a data schema along with the schema of the statistics
 * that would be collected.
 *
 * Data Schema:
 *  {{{
 *  |-- a: struct (nullable = true)
 *  |    |-- b: struct (nullable = true)
 *  |    |    |-- c: long (nullable = true)
 *  }}}
 *
 * Collected Statistics:
 *  {{{
 *  |-- stats: struct (nullable = true)
 *  |    |-- numRecords: long (nullable = false)
 *  |    |-- minValues: struct (nullable = false)
 *  |    |    |-- a: struct (nullable = false)
 *  |    |    |    |-- b: struct (nullable = false)
 *  |    |    |    |    |-- c: long (nullable = true)
 *  |    |-- maxValues: struct (nullable = false)
 *  |    |    |-- a: struct (nullable = false)
 *  |    |    |    |-- b: struct (nullable = false)
 *  |    |    |    |    |-- c: long (nullable = true)
 *  |    |-- nullCount: struct (nullable = false)
 *  |    |    |-- a: struct (nullable = false)
 *  |    |    |    |-- b: struct (nullable = false)
 *  |    |    |    |    |-- c: long (nullable = true)
 *  }}}
 */
trait StatisticsCollection extends UsesMetadataFields with DeltaLogging {
  protected def spark: SparkSession
  def dataSchema: StructType
  val numIndexedCols: Int

  /**
   * statCollectionSchema is the schema that is composed of all the columns that have the stats
   * collected with our current table configuration.
   */
  lazy val statCollectionSchema: StructType = {
    if (numIndexedCols >= 0) {
      truncateSchema(dataSchema, numIndexedCols)._1
    } else {
      dataSchema
    }
  }

  /**
   * Returns a struct column that can be used to collect statistics for the current
   * schema of the table.
   * The types we keep stats on must be consistent with DataSkippingReader.SkippingEligibleLiteral.
   */
  lazy val statsCollector: Column = {
    val stringPrefix =
      spark.sessionState.conf.getConf(DeltaSQLConf.DATA_SKIPPING_STRING_PREFIX_LENGTH)

    struct(
      count(new Column("*")) as NUM_RECORDS,
      collectStats(MIN, statCollectionSchema) {
        // Truncate string min values as necessary
        case (c, SkippingEligibleDataType(StringType)) =>
          substring(min(c), 0, stringPrefix)

        // Collect all numeric min values
        case (c, SkippingEligibleDataType(_)) =>
          min(c)
      },
      collectStats(MAX, statCollectionSchema) {
        // Truncate and pad string max values as necessary
        case (c, SkippingEligibleDataType(StringType)) =>
          val udfTruncateMax =
            DeltaUDF.stringStringUdf(StatisticsCollection.truncateMaxStringAgg(stringPrefix)_)
          udfTruncateMax(max(c))

        // Collect all numeric max values
        case (c, SkippingEligibleDataType(_)) =>
          max(c)
      },
      collectStats(NULL_COUNT, statCollectionSchema) {
        case (c, f) => sum(when(c.isNull, 1).otherwise(0))
      }
    ) as 'stats
  }

  /** Returns schema of the statistics collected. */
  lazy val statsSchema: StructType = {
    // In order to get the Delta min/max stats schema from table schema, we do 1) replace field
    // name with physical name 2) set nullable to true 3) only keep stats eligible fields
    // 4) omits metadata in table schema as Delta stats schema does not need the metadata
    def getMinMaxStatsSchema(schema: StructType): Option[StructType] = {
      val fields = schema.fields.flatMap {
        case f@StructField(_, dataType: StructType, _, _) =>
          getMinMaxStatsSchema(dataType).map { newDataType =>
            StructField(DeltaColumnMapping.getPhysicalName(f), newDataType)
          }
        case f@StructField(_, SkippingEligibleDataType(dataType), _, _) =>
          Some(StructField(DeltaColumnMapping.getPhysicalName(f), dataType))
        case _ => None
      }
      if (fields.nonEmpty) Some(StructType(fields)) else None
    }

    // In order to get the Delta null count schema from table schema, we do 1) replace field name
    // with physical name 2) set nullable to true 3) use LongType for all fields
    // 4) omits metadata in table schema as Delta stats schema does not need the metadata
    def getNullCountSchema(schema: StructType): Option[StructType] = {
      val fields = schema.fields.flatMap {
        case f@StructField(_, dataType: StructType, _, _) =>
          getNullCountSchema(dataType).map { newDataType =>
            StructField(DeltaColumnMapping.getPhysicalName(f), newDataType)
          }
        case f: StructField =>
          Some(StructField(DeltaColumnMapping.getPhysicalName(f), LongType))
      }
      if (fields.nonEmpty) Some(StructType(fields)) else None
    }

    val minMaxStatsSchemaOpt = getMinMaxStatsSchema(statCollectionSchema)
    val nullCountSchemaOpt = getNullCountSchema(statCollectionSchema)

    val fields = Array("numRecords" -> LongType) ++
      minMaxStatsSchemaOpt.map("minValues" -> _) ++
      minMaxStatsSchemaOpt.map("maxValues" -> _) ++
      nullCountSchemaOpt.map("nullCount" -> _)
    StructType(fields.map {
      case (name, dataType) => StructField(name, dataType)
    })
  }

  /**
   * Generate a truncated data schema for stats collection
   * @param schema the original data schema
   * @param indexedCols the maximum number of leaf columns to collect stats on
   * @return truncated schema and the number of leaf columns in this schema
   */
  private def truncateSchema(schema: StructType, indexedCols: Int): (StructType, Int) = {
    var accCnt = 0
    var i = 0
    var fields = ArrayBuffer[StructField]()
    while (i < schema.length && accCnt < indexedCols) {
      val field = schema.fields(i)
      val newField = field match {
        case StructField(name, st: StructType, nullable, metadata) =>
          val (newSt, cnt) = truncateSchema(st, indexedCols - accCnt)
          accCnt += cnt
          StructField(name, newSt, nullable, metadata)
        case f =>
          accCnt += 1
          f
      }
      i += 1
      fields += newField
    }
    (StructType(fields.toSeq), accCnt)
  }

  /**
   * Recursively walks the given schema, constructing an expression to calculate
   * multiple statistics that mirrors structure of the data. When `function` is
   * defined for a given column, it return value is added to statistics structure.
   * When `function` is not defined, that column is skipped.
   *
   * @param name     The name of the top level column for this statistic (i.e. minValues).
   * @param schema   The schema of the data to collect statistics from.
   * @param function A partial function that is passed both a column and metadata about that
   *                 column. Based on the metadata, it can decide if the given statistic
   *                 should be collected by returning the correct aggregate expression.
   */
  private def collectStats(
      name: String,
      schema: StructType)(
      function: PartialFunction[(Column, StructField), Column]): Column = {

    def collectStats(
      schema: StructType,
      parent: Option[Column],
      function: PartialFunction[(Column, StructField), Column]): Seq[Column] = {
      schema.flatMap {
        case f @ StructField(name, s: StructType, _, _) =>
          val column = parent.map(_.getItem(name))
            .getOrElse(new Column(UnresolvedAttribute.quoted(name)))
          val stats = collectStats(s, Some(column), function)
          if (stats.nonEmpty) {
            Some(struct(stats: _*) as DeltaColumnMapping.getPhysicalName(f))
          } else {
            None
          }
        case f @ StructField(name, _, _, _) =>
          val column = parent.map(_.getItem(name))
            .getOrElse(new Column(UnresolvedAttribute.quoted(name)))
          // alias the column with its physical name
          function.lift((column, f)).map(_.as(DeltaColumnMapping.getPhysicalName(f)))
      }
    }

    val allStats = collectStats(schema, None, function)
    val stats = if (numIndexedCols > 0) {
      allStats.take(numIndexedCols)
    } else {
      allStats
    }

    if (stats.nonEmpty) {
      struct(stats: _*).as(name)
    } else {
      lit(null).as(name)
    }
  }
}

object StatisticsCollection extends DeltaCommand {
  /**
   * Recomputes statistics for a Delta table. This can be used to compute stats if they were never
   * collected or to recompute corrupted statistics.
   * @param deltaLog Delta log for the table to update.
   * @param predicates Which subset of the data to recompute stats for. Predicates must use only
   *                   partition columns.
   * @param fileFilter Filter for which AddFiles to recompute stats for.
   */
  def recompute(
      spark: SparkSession,
      deltaLog: DeltaLog,
      predicates: Seq[Expression] = Seq(Literal(true)),
      fileFilter: AddFile => Boolean = af => true): Unit = {
    val txn = deltaLog.startTransaction()
    verifyPartitionPredicates(spark, txn.metadata.partitionColumns, predicates)

    // Save the current AddFiles that match the predicates so we can update their stats
    val files = txn.filterFiles(predicates).filter(fileFilter)
    val pathToAddFileMap = generateCandidateFileMap(deltaLog.dataPath, files)

    // Use the stats collector to recompute stats
    val dataPath = deltaLog.dataPath
    val newStats = deltaLog.createDataFrame(txn.snapshot, addFiles = files, isStreaming = false)
      .groupBy(input_file_name()).agg(to_json(txn.statsCollector))

    // Use the new stats to update the AddFiles and commit back to the DeltaLog
    val newAddFiles = newStats.collect().map { r =>
      val add = getTouchedFile(dataPath, r.getString(0), pathToAddFileMap)
      add.copy(dataChange = false, stats = r.getString(1))
    }
    txn.commit(newAddFiles, ComputeStats(predicates.map(_.sql)))
  }

  /**
   * Helper method to truncate the input string `x` to the given `prefixLen` length, while also
   * appending the unicode max character to the end of the truncated string. This ensures that any
   * value in this column is less than or equal to the max.
   */
  def truncateMaxStringAgg(prefixLen: Int)(x: String): String = {
    if (x == null || x.length <= prefixLen) {
      x
    } else {
      // Grab the prefix. We want to append `\ufffd` as a tie-breaker, but that is only safe
      // if the character we truncated was smaller. Keep extending the prefix until that
      // condition holds, or we run off the end of the string.
      // scalastyle:off nonascii
      val tieBreaker = '\ufffd'
      x.take(prefixLen) + x.substring(prefixLen).takeWhile(_ >= tieBreaker) + tieBreaker
      // scalastyle:off nonascii
    }
  }
}
