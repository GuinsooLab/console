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

import java.util.{Locale, UUID}

import scala.collection.mutable

import org.apache.spark.sql.delta.actions.{Metadata, Protocol}
import org.apache.spark.sql.delta.metering.DeltaLogging
import org.apache.spark.sql.delta.schema.{SchemaMergingUtils, SchemaUtils}

import org.apache.spark.sql.catalyst.analysis.UnresolvedAttribute
import org.apache.spark.sql.catalyst.expressions.Attribute
import org.apache.spark.sql.catalyst.util.CaseInsensitiveMap
import org.apache.spark.sql.types.{Metadata => SparkMetadata, MetadataBuilder, StructField, StructType}

trait DeltaColumnMappingBase extends DeltaLogging {
  val MIN_WRITER_VERSION = 5
  val MIN_READER_VERSION = 2
  val MIN_PROTOCOL_VERSION = Protocol(MIN_READER_VERSION, MIN_WRITER_VERSION)

  val PARQUET_FIELD_ID_METADATA_KEY = "parquet.field.id"
  val COLUMN_MAPPING_METADATA_PREFIX = "delta.columnMapping."
  val COLUMN_MAPPING_METADATA_ID_KEY = COLUMN_MAPPING_METADATA_PREFIX + "id"
  val COLUMN_MAPPING_PHYSICAL_NAME_KEY = COLUMN_MAPPING_METADATA_PREFIX + "physicalName"

  /**
   * This list of internal columns (and only this list) is allowed to have missing
   * column mapping metadata such as field id and physical name because
   * they might not be present in user's table schema.
   *
   * These fields, if materialized to parquet, will always be matched by their display name in the
   * downstream parquet reader even under column mapping modes.
   *
   * For future developers who want to utilize additional internal columns without generating
   * column mapping metadata, please add them here.
   *
   * This list is case-insensitive.
   */
  protected val DELTA_INTERNAL_COLUMNS: Set[String] = Set.empty

  val supportedModes: Set[DeltaColumnMappingMode] =
    Set(NoMapping, NameMapping)

  def isInternalField(field: StructField): Boolean = DELTA_INTERNAL_COLUMNS
    .contains(field.name.toLowerCase(Locale.ROOT))

  def requiresNewProtocol(metadata: Metadata): Boolean =
    metadata.columnMappingMode match {
      case IdMapping => true
      case NameMapping => true
      case NoMapping => false
    }

  def satisfyColumnMappingProtocol(protocol: Protocol): Boolean =
    protocol.minWriterVersion >= MIN_WRITER_VERSION &&
      protocol.minReaderVersion >= MIN_READER_VERSION

  /**
   * The only allowed mode change is from NoMapping to NameMapping. Other changes
   * would require re-writing Parquet files and are not supported right now.
   */
  private def allowMappingModeChange(
      oldMode: DeltaColumnMappingMode,
      newMode: DeltaColumnMappingMode): Boolean = {
    if (oldMode == newMode) true
    else oldMode == NoMapping && newMode == NameMapping
  }

  def isColumnMappingUpgrade(
      oldMode: DeltaColumnMappingMode,
      newMode: DeltaColumnMappingMode): Boolean = {
    oldMode == NoMapping && newMode != NoMapping
  }

  /**
   * If the table is already on the column mapping protocol, we block:
   *     - changing column mapping config
   * otherwise, we block
   *     - upgrading to the column mapping Protocol through configurations
   */
  def verifyAndUpdateMetadataChange(
      deltaLog: DeltaLog,
      oldProtocol: Protocol,
      oldMetadata: Metadata,
      newMetadata: Metadata,
      isCreatingNewTable: Boolean): Metadata = {
    // field in new metadata should have been dropped
    val oldMappingMode = oldMetadata.columnMappingMode
    val newMappingMode = newMetadata.columnMappingMode

    if (!supportedModes.contains(newMappingMode)) {
      throw DeltaErrors.unsupportedColumnMappingMode(newMappingMode.name)
    }

    val isChangingModeOnExistingTable = oldMappingMode != newMappingMode && !isCreatingNewTable
    if (isChangingModeOnExistingTable) {
      if (!allowMappingModeChange(oldMappingMode, newMappingMode)) {
        throw DeltaErrors.changeColumnMappingModeNotSupported(
          oldMappingMode.name, newMappingMode.name)
      } else {
        // legal mode change, now check if protocol is upgraded before or part of this txn
        val caseInsensitiveMap = CaseInsensitiveMap(newMetadata.configuration)
        val newProtocol = new Protocol(
          minReaderVersion = caseInsensitiveMap
            .get(Protocol.MIN_READER_VERSION_PROP).map(_.toInt)
            .getOrElse(oldProtocol.minReaderVersion),
          minWriterVersion = caseInsensitiveMap
            .get(Protocol.MIN_WRITER_VERSION_PROP).map(_.toInt)
            .getOrElse(oldProtocol.minWriterVersion))

        if (!satisfyColumnMappingProtocol(newProtocol)) {
          throw DeltaErrors.changeColumnMappingModeOnOldProtocol(oldProtocol)
        }
      }
    }

    val updatedMetadata = tryFixMetadata(oldMetadata, newMetadata, isChangingModeOnExistingTable)

    // record column mapping table creation/upgrade
    if (newMappingMode != NoMapping) {
      if (isCreatingNewTable) {
        recordDeltaEvent(deltaLog, "delta.columnMapping.createTable")
      } else if (oldMappingMode != newMappingMode) {
        recordDeltaEvent(deltaLog, "delta.columnMapping.upgradeTable")
      }
    }

    updatedMetadata
  }

  def hasColumnId(field: StructField): Boolean =
    field.metadata.contains(COLUMN_MAPPING_METADATA_ID_KEY)

  def getColumnId(field: StructField): Int =
    field.metadata.getLong(COLUMN_MAPPING_METADATA_ID_KEY).toInt

  def hasPhysicalName(field: StructField): Boolean =
    field.metadata.contains(COLUMN_MAPPING_PHYSICAL_NAME_KEY)

  /**
   * Gets the required column metadata for each column based on the column mapping mode.
   */
  def getColumnMappingMetadata(field: StructField, mode: DeltaColumnMappingMode): SparkMetadata = {
    mode match {
      case NoMapping =>
        // drop all column mapping related fields
        new MetadataBuilder()
          .withMetadata(field.metadata)
          .remove(COLUMN_MAPPING_METADATA_ID_KEY)
          .remove(PARQUET_FIELD_ID_METADATA_KEY)
          .remove(COLUMN_MAPPING_PHYSICAL_NAME_KEY)
          .build()

      case IdMapping =>
        if (!hasColumnId(field)) {
          throw DeltaErrors.missingColumnId(IdMapping, field.name)
        }
        if (!hasPhysicalName(field)) {
          throw DeltaErrors.missingPhysicalName(IdMapping, field.name)
        }
        new MetadataBuilder()
          .withMetadata(field.metadata)
          .putLong(PARQUET_FIELD_ID_METADATA_KEY, getColumnId(field))
          .build()

      case NameMapping =>
        if (!hasPhysicalName(field)) {
          throw DeltaErrors.missingPhysicalName(NameMapping, field.name)
        }
        new MetadataBuilder()
          .withMetadata(field.metadata)
          .remove(COLUMN_MAPPING_METADATA_ID_KEY)
          .remove(PARQUET_FIELD_ID_METADATA_KEY)
          .build()

      case mode =>
        throw DeltaErrors.unsupportedColumnMappingMode(mode.name)
    }
  }

  /**
   * Prepares the table schema, to be used by the readers and writers of the table.
   *
   * In the new Delta protocol that supports column mapping, we persist various column mapping
   * metadata in the serialized schema of the Delta log. This method performs the necessary
   * transformation and filtering on these metadata based on the column mapping mode set for the
   * table.
   *
   * @param schema the raw schema directly deserialized from the Delta log, with various column
   *               mapping metadata.
   * @param mode column mapping mode of the table
   *
   * @return the table schema for the readers and writers. Columns will need to be renamed
   *         by using the `renameColumns` function.
   */
  def setColumnMetadata(schema: StructType, mode: DeltaColumnMappingMode): StructType = {
    SchemaMergingUtils.transformColumns(schema) { (_, field, _) =>
      field.copy(metadata = getColumnMappingMetadata(field, mode))
    }
  }

  /** Recursively renames columns in the given schema with their physical schema. */
  def renameColumns(schema: StructType): StructType = {
    SchemaMergingUtils.transformColumns(schema) { (_, field, _) =>
      field.copy(name = getPhysicalName(field))
    }
  }

  def assignPhysicalNames(schema: StructType): StructType = {
    SchemaMergingUtils.transformColumns(schema) { (_, field, _) =>
      val existingName = if (hasPhysicalName(field)) Option(getPhysicalName(field)) else None
      val metadata = new MetadataBuilder()
        .withMetadata(field.metadata)
        .putString(COLUMN_MAPPING_PHYSICAL_NAME_KEY, existingName.getOrElse(generatePhysicalName))
        .build()
      field.copy(metadata = metadata)
    }
  }

  def generatePhysicalName: String = "col-" + UUID.randomUUID()

  def getPhysicalName(field: StructField): String = {
    if (field.metadata.contains(COLUMN_MAPPING_PHYSICAL_NAME_KEY)) {
      field.metadata.getString(COLUMN_MAPPING_PHYSICAL_NAME_KEY)
    } else {
      field.name
    }
  }

  def tryFixMetadata(
      oldMetadata: Metadata,
      newMetadata: Metadata,
      isChangingModeOnExistingTable: Boolean): Metadata = {
    val newMappingMode = DeltaConfigs.COLUMN_MAPPING_MODE.fromMetaData(newMetadata)
    newMappingMode match {
      case IdMapping | NameMapping =>
        assignColumnIdAndPhysicalName(newMetadata, oldMetadata, isChangingModeOnExistingTable)
      case NoMapping =>
        newMetadata
      case mode =>
         throw DeltaErrors.unsupportedColumnMappingMode(mode.name)
    }
  }

  def findMaxColumnId(schema: StructType): Long = {
    var maxId: Long = 0
    SchemaMergingUtils.transformColumns(schema)((_, f, _) => {
      if (hasColumnId(f)) {
        maxId = maxId max getColumnId(f)
      }
      f
    })
    maxId
  }

  def checkColumnIdAndPhysicalNameAssignments(
      schema: StructType,
      mode: DeltaColumnMappingMode): Unit = {
    // physical name/column id -> full field path
    val columnIds = mutable.Set[Int]()
    val physicalNames = mutable.Set[String]()

    // use id mapping to keep all column mapping metadata
    // this method checks for missing physical name & column id already
    val physicalSchema = createPhysicalSchema(schema, schema, IdMapping, checkSupportedMode = false)

    SchemaMergingUtils.transformColumns(physicalSchema) ((parentPhysicalPath, field, _) => {
      // field.name is now physical name
      // We also need to apply backticks to column paths with dots in them to prevent a possible
      // false alarm in which a column `a.b` is duplicated with `a`.`b`
      val curFullPhysicalPath = UnresolvedAttribute(parentPhysicalPath :+ field.name).name
      val columnId = getColumnId(field)
      if (columnIds.contains(columnId)) {
        throw DeltaErrors.duplicatedColumnId(mode, columnId, schema)
      }
      columnIds.add(columnId)

      // We should check duplication by full physical name path, because nested fields
      // such as `a.b.c` shouldn't conflict with `x.y.c` due to same column name.
      if (physicalNames.contains(curFullPhysicalPath)) {
        throw DeltaErrors.duplicatedPhysicalName(mode, curFullPhysicalPath, schema)
      }
      physicalNames.add(curFullPhysicalPath)

      field
    })
  }

  /**
   * For each column/field in a Metadata's schema, assign id using the current maximum id
   * as the basis and increment from there, and assign physical name using UUID
   * @param newMetadata The new metadata to assign Ids and physical names
   * @param oldMetadata The old metadata
   * @param isChangingModeOnExistingTable whether this is part of a commit that changes the
   *                                      mapping mode on a existing table
   * @return new metadata with Ids and physical names assigned
   */
  def assignColumnIdAndPhysicalName(
      newMetadata: Metadata,
      oldMetadata: Metadata,
      isChangingModeOnExistingTable: Boolean): Metadata = {
    val rawSchema = newMetadata.schema
    var maxId = DeltaConfigs.COLUMN_MAPPING_MAX_ID.fromMetaData(newMetadata) max
                findMaxColumnId(rawSchema)
    val newSchema =
      SchemaMergingUtils.transformColumns(rawSchema)((path, field, _) => {
        val builder = new MetadataBuilder()
          .withMetadata(field.metadata)
        if (!hasColumnId(field)) {
          maxId += 1
          builder.putLong(COLUMN_MAPPING_METADATA_ID_KEY, maxId)
        }
        if (!hasPhysicalName(field)) {
          val physicalName = if (isChangingModeOnExistingTable) {
            val fullName = path :+ field.name
            val existingField =
              SchemaUtils.findNestedFieldIgnoreCase(
                oldMetadata.schema, fullName, includeCollections = true)
            if (existingField.isEmpty) {
              throw DeltaErrors.schemaChangeDuringMappingModeChangeNotSupported(
                oldMetadata.schema, newMetadata.schema)
            } else {
              // When changing from NoMapping to NameMapping mode, we directly use old display names
              // as physical names. This is by design: 1) We don't need to rewrite the
              // existing Parquet files, and 2) display names in no-mapping mode have all the
              // properties required for physical names: unique, stable and compliant with Parquet
              // column naming restrictions.
              existingField.get.name
            }
          } else {
            generatePhysicalName
          }

          builder.putString(COLUMN_MAPPING_PHYSICAL_NAME_KEY, physicalName)
        }
        field.copy(metadata = builder.build())
      })

    newMetadata.copy(
      schemaString = newSchema.json,
      configuration =
        newMetadata.configuration ++ Map(DeltaConfigs.COLUMN_MAPPING_MAX_ID.key -> maxId.toString)
    )
  }

  def dropColumnMappingMetadata(schema: StructType): StructType = {
    SchemaMergingUtils.transformColumns(schema) { (_, field, _) =>
      field.copy(
        metadata = new MetadataBuilder()
          .withMetadata(field.metadata)
          .remove(COLUMN_MAPPING_METADATA_ID_KEY)
          .remove(COLUMN_MAPPING_PHYSICAL_NAME_KEY)
          .remove(PARQUET_FIELD_ID_METADATA_KEY)
          .build()
      )
    }
  }

  /**
   * Create a physical schema for the given schema using the Delta table schema as a reference.
   *
   * @param schema the given logical schema (potentially without any metadata)
   * @param referenceSchema the schema from the delta log, which has all the metadata
   * @param columnMappingMode column mapping mode of the delta table, which determines which
   *                          metadata to fill in
   * @param checkSupportedMode whether we should check of the column mapping mode is supported
   */
  def createPhysicalSchema(
      schema: StructType,
      referenceSchema: StructType,
      columnMappingMode: DeltaColumnMappingMode,
      checkSupportedMode: Boolean = true): StructType = {
    if (columnMappingMode == NoMapping) {
      return schema
    }

    // createPhysicalSchema is the narrow-waist for both read/write code path
    // so we could check for mode support here
    if (checkSupportedMode && !supportedModes.contains(columnMappingMode)) {
      throw DeltaErrors.unsupportedColumnMappingMode(columnMappingMode.name)
    }

    SchemaMergingUtils.transformColumns(schema) { (path, field, _) =>
      val fullName = path :+ field.name
      val inSchema = SchemaUtils
        .findNestedFieldIgnoreCase(referenceSchema, fullName, includeCollections = true)
      inSchema.map { refField =>
        val sparkMetadata = getColumnMappingMetadata(refField, columnMappingMode)
        field.copy(metadata = sparkMetadata, name = getPhysicalName(refField))
      }.getOrElse {
        if (isInternalField(field)) {
          field
        } else {
          throw DeltaErrors.columnNotFound(fullName, referenceSchema)
        }
      }
    }
  }

  /**
   * Create a list of physical attributes for the given attributes using the table schema as a
   * reference.
   *
   * @param output the list of attributes (potentially without any metadata)
   * @param referenceSchema   the table schema with all the metadata
   * @param columnMappingMode column mapping mode of the delta table, which determines which
   *                          metadata to fill in
   */
  def createPhysicalAttributes(
      output: Seq[Attribute],
      referenceSchema: StructType,
      columnMappingMode: DeltaColumnMappingMode): Seq[Attribute] = {
    // Assign correct column mapping info to columns according to the schema
    val struct = createPhysicalSchema(output.toStructType, referenceSchema, columnMappingMode)
    output.zip(struct).map { case (attr, field) =>
      attr.withDataType(field.dataType) // for recursive column names and metadata
        .withMetadata(field.metadata)
        .withName(field.name)
    }
  }

  /**
   * Returns a map of physicalNamePath -> field for the given `schema`, where
   * physicalNamePath is the [$parentPhysicalName, ..., $fieldPhysicalName] list of physical names
   * for every field (including nested) in the `schema`.
   *
   * Must be called after `checkColumnIdAndPhysicalNameAssignments`, so that we know the schema
   * is valid.
   */
  def getPhysicalNameFieldMap(schema: StructType): Map[Seq[String], StructField] = {
    val physicalSchema =
      createPhysicalSchema(schema, schema, NameMapping, checkSupportedMode = false)

    val physicalSchemaFieldPaths = SchemaMergingUtils.explode(physicalSchema).map(_._1)

    val originalSchemaFields = SchemaMergingUtils.explode(schema).map(_._2)

    physicalSchemaFieldPaths.zip(originalSchemaFields).toMap
  }

  /**
   * Returns true if Column Mapping mode is enabled and the newMetadata's schema, when compared to
   * the currentMetadata's schema, is indicative of a DROP COLUMN operation.
   *
   * We detect DROP COLUMNS by checking if any physical name in `currentSchema` is missing in
   * `newSchema`.
   */
  def isDropColumnOperation(newMetadata: Metadata, currentMetadata: Metadata): Boolean = {

    // We will need to compare the new schema's physical columns to the current schema's physical
    // columns. So, they both must have column mapping enabled.
    if (newMetadata.columnMappingMode == NoMapping ||
      currentMetadata.columnMappingMode == NoMapping) {
      return false
    }

    val newPhysicalToLogicalMap = getPhysicalNameFieldMap(newMetadata.schema)
    val currentPhysicalToLogicalMap = getPhysicalNameFieldMap(currentMetadata.schema)

    // are any of the current physical names missing in the new schema?
    currentPhysicalToLogicalMap
      .keys
      .exists { k => !newPhysicalToLogicalMap.contains(k) }
  }

  /**
   * Returns true if Column Mapping mode is enabled and the newMetadata's schema, when compared to
   * the currentMetadata's schema, is indicative of a RENAME COLUMN operation.
   *
   * We detect RENAME COLUMNS by checking if any two columns with the same physical name have
   * different logical names
   */
  def isRenameColumnOperation(newMetadata: Metadata, currentMetadata: Metadata): Boolean = {

    // We will need to compare the new schema's physical columns to the current schema's physical
    // columns. So, they both must have column mapping enabled.
    if (newMetadata.columnMappingMode == NoMapping ||
      currentMetadata.columnMappingMode == NoMapping) {
      return false
    }

    val newPhysicalToLogicalMap = getPhysicalNameFieldMap(newMetadata.schema)
    val currentPhysicalToLogicalMap = getPhysicalNameFieldMap(currentMetadata.schema)

    // do any two columns with the same physical name have different logical names?
    currentPhysicalToLogicalMap
      .exists { case (physicalPath, field) =>
        newPhysicalToLogicalMap.get(physicalPath).exists(_.name != field.name)
      }
  }
}

object DeltaColumnMapping extends DeltaColumnMappingBase

/**
 * A trait for Delta column mapping modes.
 */
sealed trait DeltaColumnMappingMode {
  def name: String
}

/**
 * No mapping mode uses a column's display name as its true identifier to
 * read and write data.
 *
 * This is the default mode and is the same mode as Delta always has been.
 */
case object NoMapping extends DeltaColumnMappingMode {
  val name = "none"
}

/**
 * Id Mapping uses column ID as the true identifier of a column. Column IDs are stored as
 * StructField metadata in the schema and will be used when reading and writing Parquet files.
 * The Parquet files in this mode will also have corresponding field Ids for each column in their
 * file schema.
 *
 * This mode is used for tables converted from Iceberg.
 */
case object IdMapping extends DeltaColumnMappingMode {
  val name = "id"
}

/**
 * Name Mapping uses the physical column name as the true identifier of a column. The physical name
 * is stored as part of StructField metadata in the schema and will be used when reading and writing
 * Parquet files. Even if id mapping can be used for reading the physical files, name mapping is
 * used for reading statistics and partition values in the DeltaLog.
 */
case object NameMapping extends DeltaColumnMappingMode {
  val name = "name"
}

object DeltaColumnMappingMode {
  def apply(name: String): DeltaColumnMappingMode = {
    name.toLowerCase(Locale.ROOT) match {
      case NoMapping.name => NoMapping
      case IdMapping.name => IdMapping
      case NameMapping.name => NameMapping
      case mode => throw DeltaErrors.unsupportedColumnMappingMode(mode)
    }
  }
}
