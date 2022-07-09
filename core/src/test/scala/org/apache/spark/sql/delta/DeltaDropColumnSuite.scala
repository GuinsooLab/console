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

import org.apache.spark.SparkConf
import org.apache.spark.sql.{AnalysisException, QueryTest, Row}
import org.apache.spark.sql.catalyst.TableIdentifier
import org.apache.spark.sql.types.{ArrayType, IntegerType, MapType, StringType, StructType}

class DeltaDropColumnSuite extends QueryTest
  with DeltaArbitraryColumnNameSuiteBase {

  override protected val sparkConf: SparkConf =
    super.sparkConf.set(DeltaSQLConf.DELTA_ALTER_TABLE_DROP_COLUMN_ENABLED.key, "true")

  protected def dropTest(testName: String)(f: ((String, Seq[String]) => Unit) => Unit): Unit = {
    test(testName) {
      def drop(table: String, columns: Seq[String]): Unit =
        sql(s"alter table $table drop column (${columns.mkString(",")})")
      f(drop)

    }
  }

  dropTest("drop column disallowed with sql flag off") { drop =>
    withSQLConf(DeltaSQLConf.DELTA_ALTER_TABLE_DROP_COLUMN_ENABLED.key -> "false") {
      withTable("t1") {
        createTableWithSQLAPI("t1",
          simpleNestedData,
          Map(DeltaConfigs.COLUMN_MAPPING_MODE.key -> "name"))

        assertException("DROP COLUMN is not supported for your Delta table") {
          drop("t1", "arr" :: Nil)
        }
      }
    }
  }

  dropTest("drop column disallowed with no mapping mode") { drop =>
    withTable("t1") {
      createTableWithSQLAPI("t1", simpleNestedData)

      assertException("DROP COLUMN is not supported for your Delta table") {
        drop("t1", "arr" :: Nil)
      }
    }
  }

  dropTest("drop column - basic") { drop =>
    withTable("t1") {
      createTableWithSQLAPI("t1",
        simpleNestedData,
        Map(DeltaConfigs.COLUMN_MAPPING_MODE.key -> "name"))

      // drop single column
      drop("t1", "arr" :: Nil)
      checkAnswer(spark.table("t1"), simpleNestedData.drop("arr"))

      // drop multiple columns
      drop("t1", "a" :: "b.c" :: Nil)
      checkAnswer(spark.table("t1"),
        Seq(
          Row(Row(1), Map("k1" -> "v1")),
          Row(Row(2), Map("k2" -> "v2"))))

      // check delta history
      checkAnswer(
        spark.sql("describe history t1")
          .select("operation", "operationParameters")
          .where("version = 3"),
        Seq(Row("DROP COLUMNS", Map("columns" -> """["a","b.c"]"""))))
    }
  }

  dropTest("dropped columns can no longer be queried") { drop =>
    withTable("t1") {
      createTableWithSQLAPI("t1",
        simpleNestedData,
        Map(DeltaConfigs.COLUMN_MAPPING_MODE.key -> "name"))

      drop("t1", "a" :: "b.c" :: "arr" :: Nil)

      // dropped column cannot be queried anymore
      val err1 = intercept[AnalysisException] {
        spark.table("t1").where("a = 'str1'").collect()
      }.getMessage
      assert(err1.contains("does not exist") || err1.contains("cannot resolve"))

      val err2 = intercept[AnalysisException] {
        spark.table("t1").select("min(a)").collect()
      }.getMessage
      assert(err2.contains("does not exist") || err2.contains("cannot resolve"))
    }
  }

  dropTest("drop column - corner cases") { drop =>
    withTable("t1") {
      createTableWithSQLAPI("t1",
        simpleNestedData,
        Map(DeltaConfigs.COLUMN_MAPPING_MODE.key -> "name"))

      drop("t1", "a" :: "b.c" :: "arr" :: Nil)

      // cannot drop the last nested field
      val e = intercept[AnalysisException] {
        drop("t1", "b.d" :: Nil)
      }
      assert(e.getMessage.contains("Cannot drop column from a struct type with a single field"))

      // can drop the parent column
      drop("t1", "b" :: Nil)

      // cannot drop the last top-level field
      val e2 = intercept[AnalysisException] {
        drop("t1", "map" :: Nil)
      }
      assert(e2.getMessage.contains("Cannot drop column from a struct type with a single field"))

      spark.sql("alter table t1 add column (e struct<e1 string, e2 string>)")

      // can drop a column with arbitrary chars
      spark.sql(s"alter table t1 rename column map to `${colName("map")}`")
      drop("t1", s"`${colName("map")}`" :: Nil)

      // only column e is left now
      assert(spark.table("t1").schema.map(_.name) == Seq("e"))

      // can drop a nested column when the top-level column is the only column
      drop("t1", "e.e1" :: Nil)
      val resultSchema = spark.table("t1").schema
      assert(resultSchema.findNestedField("e" :: "e2" :: Nil).isDefined)
      assert(resultSchema.findNestedField("e" :: "e1" :: Nil).isEmpty)
    }
  }

  dropTest("drop column with constraints") { drop =>
    withTable("t1") {
      val schemaWithNotNull =
        simpleNestedData.schema.toDDL.replace("c: STRING", "c: STRING NOT NULL")

      withTable("source") {
        spark.sql(
          s"""
             |CREATE TABLE t1 ($schemaWithNotNull)
             |USING DELTA
             |${propString(Map(DeltaConfigs.COLUMN_MAPPING_MODE.key -> "name"))}
             |""".stripMargin)
        simpleNestedData.write.format("delta").mode("append").saveAsTable("t1")
      }

      spark.sql("alter table t1 add constraint rangeABC check (concat(a, a) > 'str')")
      spark.sql("alter table t1 add constraint rangeBD check (`b`.`d` > 0)")

      spark.sql("alter table t1 add constraint arrValue check (arr[0] > 0)")

      assertException("Cannot drop column a because this column is referenced by") {
        drop("t1", "a" :: Nil)
      }

      assertException("Cannot drop column arr because this column is referenced by") {
        drop("t1", "arr" :: Nil)
      }


      // cannot drop b because its child is referenced
      assertException("Cannot drop column b because this column is referenced by") {
        drop("t1", "b" :: Nil)
      }

      // can still drop b.c because it's referenced by a null constraint
      drop("t1", "b.c" :: Nil)

      // this is a safety flag - it won't error when you turn it off
      withSQLConf(DeltaSQLConf.DELTA_ALTER_TABLE_CHANGE_COLUMN_CHECK_EXPRESSIONS.key -> "false") {
        drop("t1", "b" :: "arr" :: Nil)
      }
    }
  }

  test("drop column with constraints - map element") {
    def drop(table: String, columns: Seq[String]): Unit =
      sql(s"alter table $table drop column (${columns.mkString(",")})")

    withTable("t1") {
      val schemaWithNotNull =
        simpleNestedData.schema.toDDL.replace("c: STRING", "c: STRING NOT NULL")

      withTable("source") {
        spark.sql(
          s"""
             |CREATE TABLE t1 ($schemaWithNotNull)
             |USING DELTA
             |${propString(Map(DeltaConfigs.COLUMN_MAPPING_MODE.key -> "name"))}
             |""".stripMargin)
        simpleNestedData.write.format("delta").mode("append").saveAsTable("t1")
      }

      spark.sql("alter table t1 add constraint" +
        " mapValue check (not array_contains(map_keys(map), 'k1') or map['k1'] = 'v1')")

      assertException("Cannot drop column map because this column is referenced by") {
        drop("t1", "map" :: Nil)
      }
    }
  }

  dropTest("drop with generated column") { drop =>
    withTable("t1") {
      withSQLConf(DeltaSQLConf.DELTA_ALTER_TABLE_DROP_COLUMN_ENABLED.key -> "true") {
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

        tableBuilder
          .addColumn(genCol1)
          .addColumn(genCol2)
          .execute()

        simpleNestedData.write.format("delta").mode("append").saveAsTable("t1")

        assertException("Cannot drop column a because this column is referenced by") {
          drop("t1", "a" :: Nil)
        }

        assertException("Cannot drop column b because this column is referenced by") {
          drop("t1", "b" :: Nil)
        }

        assertException("Cannot drop column b.d because this column is referenced by") {
          drop("t1", "b.d" :: Nil)
        }

        assertException("Cannot drop column arr because this column is referenced by") {
          drop("t1", "arr" :: Nil)
        }

        // you can still drop b.c as it has no dependent gen col
        drop("t1", "b.c" :: Nil)

        // you can also drop a generated column itself
        drop("t1", "genCol1" :: Nil)

        // add new data after dropping
        spark.createDataFrame(
          Seq(Row("str3", Row(3), Map("k3" -> "v3"), Array(3, 33))).asJava,
          new StructType()
            .add("a", StringType, true)
            .add("b",
              new StructType()
                .add("d", IntegerType, true))
            .add("map", MapType(StringType, StringType), true)
            .add("arr", ArrayType(IntegerType), true))
          .write.format("delta").mode("append").saveAsTable("t1")

        checkAnswer(spark.table("t1"),
          Seq(
            Row("str1", Row(1), Map("k1" -> "v1"), Array(1, 11), 101),
            Row("str2", Row(2), Map("k2" -> "v2"), Array(2, 22), 202),
            Row("str3", Row(3), Map("k3" -> "v3"), Array(3, 33), 303)))

        // this is a safety flag - if you turn it off, it will still error but msg is not as helpful
        withSQLConf(DeltaSQLConf.DELTA_ALTER_TABLE_CHANGE_COLUMN_CHECK_EXPRESSIONS.key -> "false") {
          assertException("A generated column cannot use a non-existent column") {
            drop("t1", "arr" :: Nil)
          }
        }
      }
    }
  }

  dropTest("dropping all columns is not allowed") { drop =>
    withTable("t1") {
      createTableWithSQLAPI("t1",
        simpleNestedData,
        Map(DeltaConfigs.COLUMN_MAPPING_MODE.key -> "name")
      )
      val e = intercept[AnalysisException] {
        drop("t1", "a" :: "b" :: "map" :: "arr" :: Nil)
      }
      assert(e.getMessage.contains("Cannot drop column"))
    }
  }

  dropTest("dropping partition columns is not allowed") { drop =>
    withTable("t1") {
      createTableWithSQLAPI("t1",
        simpleNestedData,
        Map(DeltaConfigs.COLUMN_MAPPING_MODE.key -> "name"),
        partCols = Seq("a")
      )
      val e = intercept[AnalysisException] {
        drop("t1", "a" :: Nil)
      }
      assert(e.getMessage.contains("Dropping partition columns (a) is not allowed"))
    }
  }

}
