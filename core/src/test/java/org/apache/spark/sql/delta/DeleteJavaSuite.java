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

package org.apache.spark.sql.delta;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import scala.Tuple2;

import io.delta.tables.DeltaTable;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import org.apache.spark.sql.*;
import org.apache.spark.util.Utils;

public class DeleteJavaSuite implements DeltaSQLCommandJavaTest {

    private transient SparkSession spark;
    private transient String tempPath;

    @Before
    public void setUp() {
        spark = buildSparkSession();
        tempPath = Utils.createTempDir(System.getProperty("java.io.tmpdir"), "spark").toString();
    }

    @After
    public void tearDown() {
        if (spark != null) {
            spark.stop();
            spark = null;
        }
    }

    @Test
    public void testWithoutCondition() {
        Dataset<Row> targetTable = createKVDataSet(
            Arrays.asList(tuple2(1, 10), tuple2(2, 20), tuple2(3, 30), tuple2(4, 40)),
            "key", "value");
        targetTable.write().format("delta").save(tempPath);
        DeltaTable target = DeltaTable.forPath(spark, tempPath);

        target.delete();

        List<Row> expectedAnswer = new ArrayList<>();
        QueryTest$.MODULE$.checkAnswer(target.toDF(), expectedAnswer);
    }

    @Test
    public void testWithCondition() {
        Dataset<Row> targetTable = createKVDataSet(
            Arrays.asList(tuple2(1, 10), tuple2(2, 20), tuple2(3, 30), tuple2(4, 40)),
            "key", "value");
        targetTable.write().format("delta").save(tempPath);
        DeltaTable target = DeltaTable.forPath(spark, tempPath);

        target.delete("key = 1 or key = 2");

        List<Row> expectedAnswer = createKVDataSet(
            Arrays.asList(tuple2(3, 30), tuple2(4, 40))).collectAsList();
        QueryTest$.MODULE$.checkAnswer(target.toDF(), expectedAnswer);
    }

    @Test
    public void testWithColumnCondition() {
        Dataset<Row> targetTable = createKVDataSet(
            Arrays.asList(tuple2(1, 10), tuple2(2, 20), tuple2(3, 30), tuple2(4, 40)),
            "key", "value");
        targetTable.write().format("delta").save(tempPath);
        DeltaTable target = DeltaTable.forPath(spark, tempPath);

        target.delete(functions.expr("key = 1 or key = 2"));

        List<Row> expectedAnswer = createKVDataSet(
            Arrays.asList(tuple2(3, 30), tuple2(4, 40))).collectAsList();
        QueryTest$.MODULE$.checkAnswer(target.toDF(), expectedAnswer);
    }

    private Dataset<Row> createKVDataSet(
        List<Tuple2<Integer, Integer>> data, String keyName, String valueName) {
        Encoder<Tuple2<Integer, Integer>> encoder = Encoders.tuple(Encoders.INT(), Encoders.INT());
        return spark.createDataset(data, encoder).toDF(keyName, valueName);
    }

    private Dataset<Row> createKVDataSet(List<Tuple2<Integer, Integer>> data) {
        Encoder<Tuple2<Integer, Integer>> encoder = Encoders.tuple(Encoders.INT(), Encoders.INT());
        return spark.createDataset(data, encoder).toDF();
    }

    private <T1, T2> Tuple2<T1, T2> tuple2(T1 t1, T2 t2) {
        return new Tuple2<>(t1, t2);
    }
}
