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

import scala.collection.JavaConverters._

import org.apache.spark.sql.delta.sources.DeltaSQLConf
import org.scalatest.GivenWhenThen

import org.apache.spark.sql.{AnalysisException, QueryTest, Row}
import org.apache.spark.sql.types._

class DeltaColumnRenameSuite extends QueryTest
  with DeltaArbitraryColumnNameSuiteBase
  with GivenWhenThen {

  testColumnMapping("rename in column mapping mode") { mode =>
    withTable("t1") {
      createTableWithSQLAPI("t1",
        simpleNestedData,
        Map(DeltaConfigs.COLUMN_MAPPING_MODE.key -> mode),
        partCols = Seq("a"))

        spark.sql(s"Alter table t1 RENAME COLUMN b to b1")

      // insert data after rename
      spark.sql("insert into t1 " +
        "values ('str3', struct('str1.3', 3), map('k3', 'v3'), array(3, 33))")

      // some queries
      checkAnswer(
        spark.table("t1"),
        Seq(
          Row("str1", Row("str1.1", 1), Map("k1" -> "v1"), Array(1, 11)),
          Row("str2", Row("str1.2", 2), Map("k2" -> "v2"), Array(2, 22)),
          Row("str3", Row("str1.3", 3), Map("k3" -> "v3"), Array(3, 33))))

      checkAnswer(
        spark.table("t1").select("b1"),
        Seq(Row(Row("str1.1", 1)), Row(Row("str1.2", 2)), Row(Row("str1.3", 3))))

      checkAnswer(
        spark.table("t1").select("a", "b1.c").where("b1.c = 'str1.2'"),
        Seq(Row("str2", "str1.2")))

      // b is no longer visible
      val e = intercept[AnalysisException] {
        spark.table("t1").select("b").collect()
      }
      assert(e.getErrorClass == "MISSING_COLUMN")

      // rename partition column
      spark.sql(s"Alter table t1 RENAME COLUMN a to a1")
      // rename nested column
      spark.sql(s"Alter table t1 RENAME COLUMN b1.c to c1")

      // rename and verify rename history
      val renameHistoryDf = sql("DESCRIBE HISTORY t1")
          .where("operation = 'RENAME COLUMN'")
          .select("version", "operationParameters")

      checkAnswer(renameHistoryDf,
        Row(2, Map("oldColumnPath" -> "b", "newColumnPath" -> "b1")) ::
          Row(4, Map("oldColumnPath" -> "a", "newColumnPath" -> "a1")) ::
          Row(5, Map("oldColumnPath" -> "b1.c", "newColumnPath" -> "b1.c1")) :: Nil)

      // cannot rename column to the same name
      assert(
        intercept[AnalysisException] {
          spark.sql(s"Alter table t1 RENAME COLUMN map to map")
        }.getMessage.contains("map already exists in root"))

      // cannot rename to a different casing
      assert(
        intercept[AnalysisException] {
          spark.sql("Alter table t1 RENAME COLUMN arr to Arr")
        }.getMessage.contains("Arr already exists in root"))

      // a is no longer visible
      val e2 = intercept[AnalysisException] {
        spark.table("t1").select("a").collect()
      }
      assert(e2.getErrorClass == "MISSING_COLUMN")

      // b1.c is no longer visible
      val e3 = intercept[AnalysisException] {
        spark.table("t1").select("b1.c").collect()
      }
      assert(e3.getMessage.contains("No such struct field"))

      // insert data after rename
      spark.sql("insert into t1 " +
        "values ('str4', struct('str1.4', 4), map('k4', 'v4'), array(4, 44))")

      checkAnswer(
        spark.table("t1").select("a1", "b1.c1", "map")
          .where("b1.c1 = 'str1.4'"),
        Seq(Row("str4", "str1.4", Map("k4" -> "v4"))))
    }
  }

  test("rename workflow: error, upgrade to name mode and then rename") {
    // error when not in the correct protocol and mode
    withTable("t1") {
      createTableWithSQLAPI("t1",
        simpleNestedData,
        partCols = Seq("a"))
       val e = intercept[AnalysisException] {
        spark.sql(s"Alter table t1 RENAME COLUMN map to map1")
       }
      assert(e.getMessage.contains("upgrade your Delta table") &&
        e.getMessage.contains("change the column mapping mode"))

      alterTableWithProps("t1", Map(
        DeltaConfigs.COLUMN_MAPPING_MODE.key -> "name",
        DeltaConfigs.MIN_READER_VERSION.key -> "2",
        DeltaConfigs.MIN_WRITER_VERSION.key -> "5"))

      // rename a column to have arbitrary chars
      spark.sql(s"Alter table t1 RENAME COLUMN a to `${colName("a")}`")

      // rename a column that already has arbitrary chars
      spark.sql(s"Alter table t1" +
        s" RENAME COLUMN `${colName("a")}` to `${colName("a1")}`")

      // rename partition column
      spark.sql(s"Alter table t1 RENAME COLUMN map to `${colName("map")}`")

      // insert data after rename
      spark.sql("insert into t1 " +
        "values ('str3', struct('str1.3', 3), map('k3', 'v3'), array(3, 33))")

      checkAnswer(
        spark.table("t1").select(colName("a1"), "b.d", colName("map"))
          .where("b.c >= 'str1.2'"),
        Seq(Row("str2", 2, Map("k2" -> "v2")),
          Row("str3", 3, Map("k3" -> "v3"))))

      // add old column back?
      spark.sql(s"alter table t1 add columns (a string, map map<string, string>)")

      // insert data after rename
      spark.sql("insert into t1 " +
        "values ('str4', struct('str1.4', 4), map('k4', 'v4'), array(4, 44)," +
        " 'new_str4', map('new_k4', 'new_v4'))")

      checkAnswer(
        spark.table("t1").select(colName("a1"), "a", colName("map"), "map")
          .where("b.c >= 'str1.2'"),
        Seq(
          Row("str2", null, Map("k2" -> "v2"), null),
          Row("str3", null, Map("k3" -> "v3"), null),
          Row("str4", "new_str4", Map("k4" -> "v4"), Map("new_k4" -> "new_v4"))))
    }
  }

  test("rename workflow: error, upgrade to name mode and then rename - " +
    "nested data with duplicated column name") {
    withTable("t1") {
      createTableWithSQLAPI("t1", simpleNestedDataWithDuplicatedNestedColumnName)
       val e = intercept[AnalysisException] {
        spark.sql(s"Alter table t1 RENAME COLUMN map to map1")
       }
      assert(e.getMessage.contains("upgrade your Delta table") &&
        e.getMessage.contains("change the column mapping mode"))

      // Upgrading this schema shouldn't cause any errors even if there are leaf column name
      // duplications such as a.c, b.c.
      alterTableWithProps("t1", Map(
        DeltaConfigs.COLUMN_MAPPING_MODE.key -> "name",
        DeltaConfigs.MIN_READER_VERSION.key -> "2",
        DeltaConfigs.MIN_WRITER_VERSION.key -> "5"))

      // rename shouldn't cause duplicates in column names
      Seq(("a", "b"), ("arr", "map")).foreach { case (from, to) =>
        val e = intercept[AnalysisException] {
          spark.sql(s"Alter table t1 RENAME COLUMN $from to $to")
        }
        assert(e.getMessage.contains("Cannot rename column"))
      }

      // spice things up by changing name to arbitrary chars
      spark.sql(s"Alter table t1 RENAME COLUMN a to `${colName("a")}`")
      // rename partition column
      spark.sql(s"Alter table t1 RENAME COLUMN map to `${colName("map")}`")

      // insert data after rename
      spark.sql("insert into t1 " +
        "values (struct('str3', 3), struct('str1.3', 3), map('k3', 'v3'), array(3, 33))")

      checkAnswer(
        spark.table("t1").select(colName("a"), "b.d", colName("map"))
          .where("b.c >= 'str1.2'"),
        Seq(Row(Row("str2", 2), 2, Map("k2" -> "v2")),
          Row(Row("str3", 3), 3, Map("k3" -> "v3"))))

      // add old column back?
      spark.sql(s"alter table t1 add columns (a string, map map<string, string>)")

      // insert data after rename
      spark.sql("insert into t1 " +
        "values (struct('str4', 4), struct('str1.4', 4), map('k4', 'v4'), array(4, 44)," +
        " 'new_str4', map('new_k4', 'new_v4'))")

      checkAnswer(
        spark.table("t1").select(colName("a"), "a", colName("map"), "map")
          .where("b.c >= 'str1.2'"),
        Seq(
          Row(Row("str2", 2), null, Map("k2" -> "v2"), null),
          Row(Row("str3", 3), null, Map("k3" -> "v3"), null),
          Row(Row("str4", 4), "new_str4", Map("k4" -> "v4"), Map("new_k4" -> "new_v4"))))
    }
  }

  test("rename with constraints") {
    withTable("t1") {
      val schemaWithNotNull =
        simpleNestedData.schema.toDDL.replace("c: STRING", "c: STRING NOT NULL")
          .replace("`c`: STRING", "`c`: STRING NOT NULL")

      withTable("source") {
        spark.sql(
          s"""
             |CREATE TABLE t1 ($schemaWithNotNull)
             |USING DELTA
             |${partitionStmt(Seq("a"))}
             |${propString(Map(DeltaConfigs.COLUMN_MAPPING_MODE.key -> "name"))}
             |""".stripMargin)
        simpleNestedData.write.format("delta").mode("append").saveAsTable("t1")
      }

      spark.sql("alter table t1 add constraint rangeABC check (concat(a, a) > 'str')")
      spark.sql("alter table t1 add constraint rangeBD check (`b`.`d` > 0)")

      spark.sql("alter table t1 add constraint arrValue check (arr[0] > 0)")

      assertException("Cannot rename column a") {
        spark.sql("alter table t1 rename column a to a1")
      }

      assertException("Cannot rename column arr") {
        spark.sql("alter table t1 rename column arr to arr1")
      }


      // cannot rename b because its child is referenced
      assertException("Cannot rename column b") {
        spark.sql("alter table t1 rename column b to b1")
      }

      // can still rename b.c because it's referenced by a null constraint
      spark.sql("alter table t1 rename column b.c to c1")

      spark.sql("insert into t1 " +
        "values ('str3', struct('str1.3', 3), map('k3', 'v3'), array(3, 33))")

      assertException("CHECK constraint rangeabc (concat(a, a) > 'str')") {
        spark.sql("insert into t1 " +
          "values ('fail constraint', struct('str1.3', 3), map('k3', 'v3'), array(3, 33))")
      }

      assertException("CHECK constraint rangebd (b.d > 0)") {
        spark.sql("insert into t1 " +
          "values ('str3', struct('str1.3', -1), map('k3', 'v3'), array(3, 33))")
      }

      assertException("NOT NULL constraint violated for column: b.c1") {
        spark.sql("insert into t1 " +
          "values ('str3', struct(null, 3), map('k3', 'v3'), array(3, 33))")
      }

      // this is a safety flag - it won't error when you turn it off
      withSQLConf(DeltaSQLConf.DELTA_ALTER_TABLE_CHANGE_COLUMN_CHECK_EXPRESSIONS.key -> "false") {
        spark.sql("alter table t1 rename column a to a1")
        spark.sql("alter table t1 rename column arr to arr1")
        spark.sql("alter table t1 rename column b to b1")
      }
    }
  }

  test("rename with constraints - map element") {
    withTable("t1") {
      val schemaWithNotNull =
        simpleNestedData.schema.toDDL.replace("c: STRING", "c: STRING NOT NULL")
          .replace("`c`: STRING", "`c`: STRING NOT NULL")

      withTable("source") {
        spark.sql(
          s"""
             |CREATE TABLE t1 ($schemaWithNotNull)
             |USING DELTA
             |${partitionStmt(Seq("a"))}
             |${propString(Map(DeltaConfigs.COLUMN_MAPPING_MODE.key -> "name"))}
             |""".stripMargin)
        simpleNestedData.write.format("delta").mode("append").saveAsTable("t1")
      }

      spark.sql("alter table t1 add constraint" +
        " mapValue check (not array_contains(map_keys(map), 'k1') or map['k1'] = 'v1')")

      assertException("Cannot rename column map") {
        spark.sql("alter table t1 rename column map to map1")
      }

      spark.sql("insert into t1 " +
        "values ('str3', struct('str1.3', 3), map('k3', 'v3'), array(3, 33))")
    }
  }

  test("rename with generated column") {
    withTable("t1") {
      val tableBuilder = io.delta.tables.DeltaTable.create(spark).tableName("t1")
      tableBuilder.property("delta.columnMapping.mode", "name")

      // add existing columns
      simpleNestedSchema.map(field => (field.name, field.dataType)).foreach(col => {
        val (colName, dataType) = col
        val columnBuilder = io.delta.tables.DeltaTable.columnBuilder(spark, colName)
        columnBuilder.dataType(dataType.sql)
        tableBuilder.addColumn(columnBuilder.build())
      })

      // add generated columns
      val genCol1 = io.delta.tables.DeltaTable.columnBuilder(spark, "genCol1")
        .dataType("int")
        .generatedAlwaysAs("length(a)")
        .build()

      val genCol2 = io.delta.tables.DeltaTable.columnBuilder(spark, "genCol2")
        .dataType("int")
        .generatedAlwaysAs("b.d * 100 + arr[0]")
        .build()

      val genCol3 = io.delta.tables.DeltaTable.columnBuilder(spark, "genCol3")
        .dataType("string")
        .generatedAlwaysAs("concat(a, a)")
        .build()

      tableBuilder
        .addColumn(genCol1)
        .addColumn(genCol2)
        .addColumn(genCol3)
        .partitionedBy("genCol2")
        .execute()

      simpleNestedData.write.format("delta").mode("append").saveAsTable("t1")

      assertException("Cannot rename column a") {
        spark.sql("alter table t1 rename column a to a1")
      }

      assertException("Cannot rename column b") {
        spark.sql("alter table t1 rename column b to b1")
      }

      assertException("Cannot rename column b.d") {
        spark.sql("alter table t1 rename column b.d to d1")
      }

      assertException("Cannot rename column arr") {
        spark.sql("alter table t1 rename column arr to arr1")
      }

      // you can still rename b.c
      spark.sql("alter table t1 rename column b.c to c1")

      // The following is just to show generated columns are actually there

      // add new data (without data for generated columns so that they are auto populated)
      spark.createDataFrame(
        Seq(Row("str3", Row("str1.3", 3), Map("k3" -> "v3"), Array(3, 33))).asJava,
        new StructType()
         .add("a", StringType, true)
          .add("b",
        new StructType()
          .add("c1", StringType, true)
          .add("d", IntegerType, true))
          .add("map", MapType(StringType, StringType), true)
          .add("arr", ArrayType(IntegerType), true))
      .write.format("delta").mode("append").saveAsTable("t1")

      checkAnswer(spark.table("t1"),
        Seq(
            Row("str1", Row("str1.1", 1), Map("k1" -> "v1"), Array(1, 11), 4, 101, "str1str1"),
            Row("str2", Row("str1.2", 2), Map("k2" -> "v2"), Array(2, 22), 4, 202, "str2str2"),
            Row("str3", Row("str1.3", 3), Map("k3" -> "v3"), Array(3, 33), 4, 303, "str3str3")))

      // this is a safety flag - if you turn it off, it will still error but msg is not as helpful
      withSQLConf(DeltaSQLConf.DELTA_ALTER_TABLE_CHANGE_COLUMN_CHECK_EXPRESSIONS.key -> "false") {
        assertException("A generated column cannot use a non-existent column") {
          spark.sql("alter table t1 rename column arr to arr1")
        }
        assertException("No such struct field d in c1, d1") {
          spark.sql("alter table t1 rename column b.d to d1")
        }
      }
    }
  }
}
