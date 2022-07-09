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

import org.apache.spark.sql.delta.actions.Metadata

import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.execution.datasources.FileFormat

trait DeltaFileFormat {
  // TODO: Add support for column mapping
  /** Return the current metadata for preparing this file format */
  protected def metadata: Metadata
  /** Return the current Spark session used. */
  protected def spark: SparkSession
  /**
   * Build the underlying Spark `FileFormat` of the Delta table with specified metadata.
   *
   * With column mapping, some properties of the underlying file format might change during
   * transaction, so if possible, we should always pass in the latest transaction's metadata
   * instead of one from a past snapshot.
   */
  def fileFormat(metadata: Metadata = metadata): FileFormat =
    new DeltaParquetFileFormat(metadata.columnMappingMode, metadata.schema)
}
