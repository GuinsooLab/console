<div align="center">
   <img src="assets/guinsoolab-console.svg" width="120" alt="console"/>
   <br/>
   <small>Management UI for GuinsooLab</small>
</div>

# [GuinsooLab Console](https://guinsoolab.github.io/glab/)

![arichitecture](assets/gdp-new.svg)

GuinsooLab is an open-source storage framework that enables building a [Lakehouse architecture](http://cidrdb.org/cidr2021/papers/cidr2021_paper17.pdf) with compute engines including Spark, PrestoDB, Flink, Trino, and Hive and APIs for Scala, Java, Rust, Ruby, and Python. 
* See the [Delta Lake Documentation](https://docs.delta.io) for details.
* See the [Quick Start Guide](https://docs.delta.io/latest/quick-start.html) to get started with Scala, Java and Python.
* Note, this repo is one of many Delta Lake repositories in the [delta.io](https://github.com/delta-io) organizations including 
[connectors](https://github.com/delta-io/connectors),
[delta](https://github.com/delta-io/delta), 
[delta-rs](https://github.com/delta-io/delta-rs),
[delta-sharing](https://github.com/delta-io/delta-sharing),
[kafka-delta-ingest](https://github.com/delta-io/kafka-delta-ingest), and
[website](https://github.com/delta-io/website).

The following are some of the more popular Delta Lake integrations, refer to [delta.io/integrations](https://delta.io/integrations/) for the complete list:

* [Apache Spark™](https://docs.delta.io/): This connector allows Apache Spark™ to read from and write to Delta Lake.
* [Apache Flink (Preview)](https://github.com/delta-io/connectors/tree/master/flink): This connector allows Apache Flink to write to Delta Lake.
* [PrestoDB](https://prestodb.io/docs/current/connector/deltalake.html): This connector allows PrestoDB to read from Delta Lake.
* [Trino](https://trino.io/docs/current/connector/delta-lake.html): This connector allows Trino to read from and write to Delta Lake.
* [Delta Standalone](https://docs.delta.io/latest/delta-standalone.html): This library allows Scala and Java-based projects (including Apache Flink, Apache Hive, Apache Beam, and PrestoDB) to read from and write to Delta Lake.
* [Apache Hive](https://docs.delta.io/latest/hive-integration.html): This connector allows Apache Hive to read from Delta Lake.
* [Delta Rust API](https://docs.rs/deltalake/latest/deltalake/): This library allows Rust (with Python and Ruby bindings) low level access to Delta tables and is intended to be used with data processing frameworks like datafusion, ballista, rust-dataframe, vega, etc.

For more built-in components, please click [here](https://ciusji.gitbook.io/guinsoolab/) to learn more.

<br/>

<details>
<summary><strong><em>Table of Contents</em></strong></summary>

* [Latest binaries](#latest-binaries)
* [API Documentation](#api-documentation)
* [Compatibility](#compatibility)
  * [API Compatibility](#api-compatibility)
  * [Data Storage Compatibility](#data-storage-compatibility)
* [Roadmap](#roadmap)
* [Building](#building)
* [Transaction Protocol](#transaction-protocol)
* [Requirements for Underlying Storage Systems](#requirements-for-underlying-storage-systems)
* [Concurrency Control](#concurrency-control)
* [Reporting issues](#reporting-issues)
* [Contributing](#contributing)
* [License](#license)
* [Community](#community)
</details>


## Latest Binaries

See the [online documentation](https://docs.delta.io/latest/) for the latest release.

## API Documentation

* [Scala API docs](https://docs.delta.io/latest/delta-apidoc.html)
* [Java API docs](https://docs.delta.io/latest/api/java/index.html)
* [Python API docs](https://docs.delta.io/latest/api/python/index.html)

## Compatibility
[Delta Standalone](https://docs.delta.io/latest/delta-standalone.html) library is a single-node Java library that can be used to read from and write to Delta tables. Specifically, this library provides APIs to interact with a table’s metadata in the transaction log, implementing the Delta Transaction Log Protocol to achieve the transactional guarantees of the Delta Lake format.


### API Compatibility

There are two types of APIs provided by the Delta Lake project. 

- Direct Java/Scala/Python APIs - The classes and methods documented in the [API docs](https://docs.delta.io/latest/delta-apidoc.html) are considered as stable public APIs. All other classes, interfaces, methods that may be directly accessible in code are considered internal, and they are subject to change across releases.
- Spark-based APIs - You can read Delta tables through the `DataFrameReader`/`Writer` (i.e. `spark.read`, `df.write`, `spark.readStream` and `df.writeStream`). Options to these APIs will remain stable within a major release of Delta Lake (e.g., 1.x.x).
- See the [online documentation](https://docs.delta.io/latest/releases.html) for the releases and their compatibility with Apache Spark versions.


### Data Storage Compatibility

GuinsooLab guarantees backward compatibility for all GuinsooLab tables (i.e., newer versions of Delta Lake will always be able to read tables written by older versions of Delta Lake). However, we reserve the right to break forward compatibility as new features are introduced to the transaction protocol (i.e., an older version of Delta Lake may not be able to read a table produced by a newer version).

Breaking changes in the protocol are indicated by incrementing the minimum reader/writer version in the `Protocol` [action](https://github.com/delta-io/delta/blob/master/core/src/test/scala/org/apache/spark/sql/delta/ActionSerializerSuite.scala).

## Roadmap

* For the high-level Delta Lake roadmap, see [Delta Lake 2022H1 roadmap](http://delta.io/roadmap).  
* For the detailed timeline, see the [project roadmap](https://github.com/delta-io/delta/milestones). 

## Transaction Protocol

[Delta Transaction Log Protocol](PROTOCOL.md) document provides a specification of the transaction protocol.

## Requirements for Underlying Storage Systems

GuinsooLab ACID guarantees are predicated on the atomicity and durability guarantees of the storage system. Specifically, we require the storage system to provide the following.

1. **Atomic visibility**: There must be a way for a file to be visible in its entirety or not visible at all.
2. **Mutual exclusion**: Only one writer must be able to create (or rename) a file at the final destination.
3. **Consistent listing**: Once a file has been written in a directory, all future listings for that directory must return that file.

See the [online documentation on Storage Configuration](https://docs.delta.io/latest/delta-storage.html) for details.

## Concurrency Control

Delta Lake ensures _serializability_ for concurrent reads and writes. Please see [Delta Lake Concurrency Control](https://docs.delta.io/latest/delta-concurrency.html) for more details.

## Reporting issues

We use [GitHub Issues](https://github.com/delta-io/delta/issues) to track community reported issues. You can also [contact](#community) the community for getting answers.

## Contributing 

We welcome contributions to Delta Lake. See our [CONTRIBUTING.md](https://github.com/delta-io/delta/blob/master/CONTRIBUTING.md) for more details.

We also adhere to the [Delta Lake Code of Conduct](https://github.com/delta-io/delta/blob/master/CODE_OF_CONDUCT.md).

## Building

GuinsooLab is compiled using [SBT](https://www.scala-sbt.org/1.x/docs/Command-Line-Reference.html).

To compile, run

    build/sbt compile

To generate artifacts, run

    build/sbt package

To execute tests, run

    build/sbt test

To execute a single test suite, run

    build/sbt 'testOnly org.apache.spark.sql.delta.optimize.OptimizeCompactionSuite'

To execute a single test within and a single test suite, run

    build/sbt 'testOnly *.OptimizeCompactionSuite -- -z "optimize command: on partitioned table - all partitions"'

Refer to [SBT docs](https://www.scala-sbt.org/1.x/docs/Command-Line-Reference.html) for more commands.

## IntelliJ Setup

IntelliJ is the recommended IDE to use when developing Delta Lake. To import Delta Lake as a new project:
1. Clone Delta Lake into, for example, `~/delta`.
2. In IntelliJ, select `File` > `New Project` > `Project from Existing Sources...` and select `~/delta`.
3. Under `Import project from external model` select `sbt`. Click `Next`.
4. Under `Project JDK` specify a valid Java `1.8` JDK and opt to use SBT shell for `project reload` and `builds`.
5. Click `Finish`.

### Setup Verification

After waiting for IntelliJ to index, verify your setup by running a test suite in IntelliJ.
1. Search for and open `DeltaLogSuite`
2. Next to the class declaration, right click on the two green arrows and select `Run 'DeltaLogSuite'`

### Troubleshooting

If you see errors of the form

```
Error:(46, 28) object DeltaSqlBaseParser is not a member of package io.delta.sql.parser
import io.delta.sql.parser.DeltaSqlBaseParser._
...
Error:(91, 22) not found: type DeltaSqlBaseParser
    val parser = new DeltaSqlBaseParser(tokenStream)
```

then follow these steps:
1. Compile using the SBT CLI: `build/sbt compile`.
2. Go to `File` > `Project Structure...` > `Modules` > `delta-core`.
3. In the right panel under `Source Folders` remove any `target` folders, e.g. `target/scala-2.12/src_managed/main [generated]`
4. Click `Apply` and then re-run your test.

## License

Apache License 2.0, see [LICENSE](https://github.com/delta-io/delta/blob/master/LICENSE.txt).
