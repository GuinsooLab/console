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

package io.delta.tables

import org.apache.spark.sql.delta.commands.OptimizeTableCommand
import org.apache.spark.sql.delta.util.AnalysisHelper

import org.apache.spark.annotation._
import org.apache.spark.sql.{AnalysisException, Column, DataFrame, SparkSession}
import org.apache.spark.sql.catalyst.TableIdentifier
import org.apache.spark.sql.catalyst.analysis.UnresolvedAttribute
import org.apache.spark.sql.catalyst.parser.ParseException

/**
 * Builder class for constructing OPTIMIZE command and executing.
 *
 * @param sparkSession SparkSession to use for execution
 * @param tableIdentifier Id of the table on which to
 *        execute the optimize
 * @since 1.3.0
 */
class DeltaOptimizeBuilder private(
    sparkSession: SparkSession,
    tableIdentifier: String) extends AnalysisHelper {
  @volatile private var partitionFilter: Option[String] = None

  /**
   * Apply partition filter on this optimize command builder to limit
   * the operation on selected partitions.
   * @param partitionFilter The partition filter to apply
   * @return [[DeltaOptimizeBuilder]] with partition filter applied
   */
  def where(partitionFilter: String): DeltaOptimizeBuilder = {
    this.partitionFilter = Some(partitionFilter)
    this
  }

  /**
   * Compact the small files in selected partitions.
   * @return DataFrame containing the OPTIMIZE execution metrics
   */
  def executeCompaction(): DataFrame = {
    execute(Seq.empty)
  }

   /**
   * Z-Order the data in selected partitions using the given columns.
   * @param columns Zero or more columns to order the data
   *                using Z-Order curves
   * @return DataFrame containing the OPTIMIZE execution metrics
   */
  def executeZOrderBy(columns: String *): DataFrame = {
    val attrs = columns.map(c => UnresolvedAttribute(c))
    execute(attrs)
  }

  private def execute(zOrderBy: Seq[UnresolvedAttribute]): DataFrame = {
    val tableId: TableIdentifier = sparkSession
      .sessionState
      .sqlParser
      .parseTableIdentifier(tableIdentifier)
    val optimize = OptimizeTableCommand(None, Some(tableId), partitionFilter)(zOrderBy = zOrderBy)
    toDataset(sparkSession, optimize)
  }
}

private[delta] object DeltaOptimizeBuilder {
  /**
   * :: Unstable ::
   *
   * Private method for internal usage only. Do not call this directly.
   */
  @Unstable
  private[delta] def apply(
      sparkSession: SparkSession,
      tableIdentifier: String): DeltaOptimizeBuilder = {
    new DeltaOptimizeBuilder(sparkSession, tableIdentifier)
  }
}
