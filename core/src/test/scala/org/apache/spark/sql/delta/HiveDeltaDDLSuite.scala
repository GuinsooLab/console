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

import org.apache.spark.sql.delta.hooks.GenerateSymlinkManifest
import org.apache.spark.sql.delta.test.DeltaHiveTest

import org.apache.spark.sql.AnalysisException
import org.apache.spark.sql.hive.test.TestHiveSingleton

abstract class HiveDeltaDDLSuiteBase
  extends DeltaDDLTestBase {
  import testImplicits._

  override protected def verifyDescribeTable(tblName: String): Unit = {
    val res = sql(s"DESCRIBE TABLE $tblName").collect()
    assert(res.takeRight(2).map(_.getString(1)) === Seq("name", "dept"))
  }

  override protected def verifyNullabilityFailure(exception: AnalysisException): Unit = {
    exception.getMessage.contains("not supported for changing column")
  }

}

class HiveDeltaDDLSuite extends HiveDeltaDDLSuiteBase with DeltaHiveTest
