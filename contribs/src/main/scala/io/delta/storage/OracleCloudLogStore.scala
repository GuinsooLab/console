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

package io.delta.storage

import org.apache.hadoop.conf.Configuration
import org.apache.hadoop.fs.{FileSystem, Path}

import org.apache.spark.SparkConf
import org.apache.spark.annotation.Unstable

/**
 * :: Unstable ::
 *
 * LogStore implementation for OCI (Oracle Cloud Infrastructure).
 *
 * We assume the following from OCI (Oracle Cloud Infrastructure)'s BmcFilesystem implementations:
 * - Rename without overwrite is atomic.
 * - List-after-write is consistent.
 *
 * Regarding file creation, this implementation:
 * - Uses atomic rename when overwrite is false; if the destination file exists or the rename
 *   fails, throws an exception.
 * - Uses create-with-overwrite when overwrite is true. This does not make the file atomically
 *   visible and therefore the caller must handle partial files.
 *
 * @note This class is not meant for direct access but for configuration based on storage system.
 *       See https://docs.delta.io/latest/delta-storage.html for details.
 */
@Unstable
class OracleCloudLogStore(sparkConf: SparkConf, initHadoopConf: Configuration)
  extends org.apache.spark.sql.delta.storage.HadoopFileSystemLogStore(sparkConf, initHadoopConf) {

  override def write(path: Path, actions: Iterator[String], overwrite: Boolean = false): Unit = {
    write(path, actions, overwrite, getHadoopConfiguration)
  }

  override def write(
      path: Path,
      actions: Iterator[String],
      overwrite: Boolean,
      hadoopConf: Configuration): Unit = {
    writeWithRename(path, actions, overwrite, hadoopConf)
  }

  override def invalidateCache(): Unit = {}

  override def isPartialWriteVisible(path: Path): Boolean = true

  override def isPartialWriteVisible(path: Path, hadoopConf: Configuration): Boolean = true
}
