/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * This file contains code from the Apache Spark project (original license above).
 * It contains modifications, which are licensed as follows:
 */

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

package io.delta.sql.parser

import java.util.Locale

import scala.collection.JavaConverters._

import org.apache.spark.sql.catalyst.TimeTravel

import org.apache.spark.sql.delta._
import org.apache.spark.sql.delta.commands._
import io.delta.sql.parser.DeltaSqlBaseParser._
import io.delta.tables.execution.VacuumTableCommand
import org.antlr.v4.runtime._
import org.antlr.v4.runtime.atn.PredictionMode
import org.antlr.v4.runtime.misc.{Interval, ParseCancellationException}
import org.antlr.v4.runtime.tree._

import org.apache.spark.sql.AnalysisException
import org.apache.spark.sql.catalyst.expressions.{Expression, Literal}
import org.apache.spark.sql.catalyst.{FunctionIdentifier, TableIdentifier}
import org.apache.spark.sql.catalyst.analysis._
import org.apache.spark.sql.catalyst.parser.{ParseErrorListener, ParseException, ParserInterface}
import org.apache.spark.sql.catalyst.parser.ParserUtils.{string, withOrigin}
import org.apache.spark.sql.catalyst.plans.logical.{AlterTableAddConstraint, AlterTableDropConstraint, LogicalPlan, RestoreTableStatement}
import org.apache.spark.sql.catalyst.trees.Origin
import org.apache.spark.sql.types._

/**
 * A SQL parser that tries to parse Delta commands. If failng to parse the SQL text, it will
 * forward the call to `delegate`.
 */
class DeltaSqlParser(val delegate: ParserInterface) extends ParserInterface {
  private val builder = new DeltaSqlAstBuilder

  override def parsePlan(sqlText: String): LogicalPlan = parse(sqlText) { parser =>
    builder.visit(parser.singleStatement()) match {
      case plan: LogicalPlan => plan
      case _ => delegate.parsePlan(sqlText)
    }
  }

  // scalastyle:off line.size.limit
  /**
   * Fork from `org.apache.spark.sql.catalyst.parser.AbstractSqlParser#parse(java.lang.String, scala.Function1)`.
   *
   * @see https://github.com/apache/spark/blob/v2.4.4/sql/catalyst/src/main/scala/org/apache/spark/sql/catalyst/parser/ParseDriver.scala#L81
   */
  // scalastyle:on
  protected def parse[T](command: String)(toResult: DeltaSqlBaseParser => T): T = {
    val lexer = new DeltaSqlBaseLexer(
      new UpperCaseCharStream(CharStreams.fromString(command)))
    lexer.removeErrorListeners()
    lexer.addErrorListener(ParseErrorListener)

    val tokenStream = new CommonTokenStream(lexer)
    val parser = new DeltaSqlBaseParser(tokenStream)
    parser.addParseListener(PostProcessor)
    parser.removeErrorListeners()
    parser.addErrorListener(ParseErrorListener)

    try {
      try {
        // first, try parsing with potentially faster SLL mode
        parser.getInterpreter.setPredictionMode(PredictionMode.SLL)
        toResult(parser)
      } catch {
        case e: ParseCancellationException =>
          // if we fail, parse with LL mode
          tokenStream.seek(0) // rewind input stream
          parser.reset()

          // Try Again.
          parser.getInterpreter.setPredictionMode(PredictionMode.LL)
          toResult(parser)
      }
    } catch {
      case e: ParseException if e.command.isDefined =>
        throw e
      case e: ParseException =>
        throw e.withCommand(command)
      case e: AnalysisException =>
        val position = Origin(e.line, e.startPosition)
        throw new ParseException(Option(command), e.message, position, position)
    }
  }

  override def parseExpression(sqlText: String): Expression = delegate.parseExpression(sqlText)

  override def parseTableIdentifier(sqlText: String): TableIdentifier =
    delegate.parseTableIdentifier(sqlText)

  override def parseFunctionIdentifier(sqlText: String): FunctionIdentifier =
    delegate.parseFunctionIdentifier(sqlText)

  override def parseMultipartIdentifier (sqlText: String): Seq[String] =
    delegate.parseMultipartIdentifier(sqlText)

  override def parseTableSchema(sqlText: String): StructType = delegate.parseTableSchema(sqlText)

  override def parseDataType(sqlText: String): DataType = delegate.parseDataType(sqlText)
}

/**
 * Define how to convert an AST generated from `DeltaSqlBase.g4` to a `LogicalPlan`. The parent
 * class `DeltaSqlBaseBaseVisitor` defines all visitXXX methods generated from `#` instructions in
 * `DeltaSqlBase.g4` (such as `#vacuumTable`).
 */
class DeltaSqlAstBuilder extends DeltaSqlBaseBaseVisitor[AnyRef] {

  /**
   * Create a [[VacuumTableCommand]] logical plan. Example SQL:
   * {{{
   *   VACUUM ('/path/to/dir' | delta.`/path/to/dir`) [RETAIN number HOURS] [DRY RUN];
   * }}}
   */
  override def visitVacuumTable(ctx: VacuumTableContext): AnyRef = withOrigin(ctx) {
    VacuumTableCommand(
      Option(ctx.path).map(string),
      Option(ctx.table).map(visitTableIdentifier),
      Option(ctx.number).map(_.getText.toDouble),
      ctx.RUN != null)
  }

  /** Provides a list of unresolved attributes for multi dimensional clustering. */
  override def visitZorderSpec(ctx: ZorderSpecContext): Seq[UnresolvedAttribute] = {
    ctx.interleave.asScala
      .map(_.identifier.asScala.map(_.getText).toSeq)
      .map(new UnresolvedAttribute(_)).toSeq
  }

  /**
   * Create a [[OptimizeTableCommand]] logical plan.
   * Syntax:
   * {{{
   *    OPTIMIZE <table-identifier>
   *      [WHERE predicate-using-partition-columns]
   *      [ZORDER BY [(] col1, col2 ..[)]]
   * }}}
   * Examples:
   * {{{
   *    OPTIMIZE '/path/to/delta/table';
   *    OPTIMIZE delta_table_name;
   *    OPTIMIZE delta.`/path/to/delta/table`;
   *    OPTIMIZE delta_table_name WHERE partCol = 25;
   *    OPTIMIZE delta_table_name WHERE partCol = 25 ZORDER BY col2, col2;
   * }}}
   */
  override def visitOptimizeTable(ctx: OptimizeTableContext): AnyRef = withOrigin(ctx) {
    if (ctx.path == null && ctx.table == null) {
      throw new ParseException("OPTIMIZE command requires a file path or table name.", ctx)
    }
    val interleaveBy = Option(ctx.zorderSpec).map(visitZorderSpec).getOrElse(Seq.empty)
    OptimizeTableCommand(
      Option(ctx.path).map(string),
      Option(ctx.table).map(visitTableIdentifier),
      Option(ctx.partitionPredicate).map(extractRawText(_)))(interleaveBy)
  }

  override def visitDescribeDeltaDetail(
      ctx: DescribeDeltaDetailContext): LogicalPlan = withOrigin(ctx) {
    DescribeDeltaDetailCommand(
      Option(ctx.path).map(string),
      Option(ctx.table).map(visitTableIdentifier))
  }

  override def visitDescribeDeltaHistory(
      ctx: DescribeDeltaHistoryContext): LogicalPlan = withOrigin(ctx) {
    DescribeDeltaHistoryCommand(
      Option(ctx.path).map(string),
      Option(ctx.table).map(visitTableIdentifier),
      Option(ctx.limit).map(_.getText.toInt))
  }

  override def visitGenerate(ctx: GenerateContext): LogicalPlan = withOrigin(ctx) {
    DeltaGenerateCommand(
      modeName = ctx.modeName.getText,
      tableId = visitTableIdentifier(ctx.table))
  }

  override def visitConvert(ctx: ConvertContext): LogicalPlan = withOrigin(ctx) {
    ConvertToDeltaCommand(
      visitTableIdentifier(ctx.table),
      Option(ctx.colTypeList).map(colTypeList => StructType(visitColTypeList(colTypeList))),
      None)
  }

  override def visitRestore(ctx: RestoreContext): LogicalPlan = withOrigin(ctx) {
    val tableRelation = UnresolvedRelation(visitTableIdentifier(ctx.table))
    val timeTravelTableRelation = maybeTimeTravelChild(ctx.clause, tableRelation)
    RestoreTableStatement(timeTravelTableRelation.asInstanceOf[TimeTravel])
  }

  /**
   * Time travel the table to the given version or timestamp.
   */
  private def maybeTimeTravelChild(ctx: TemporalClauseContext, child: LogicalPlan): LogicalPlan = {
    if (ctx == null) return child
    TimeTravel(
      child,
      Option(ctx.timestamp).map(token => Literal(token.getText.replaceAll("^'|'$", ""))),
      Option(ctx.version).map(_.getText.toLong),
      Some("sql"))
  }

  override def visitSingleStatement(ctx: SingleStatementContext): LogicalPlan = withOrigin(ctx) {
    visit(ctx.statement).asInstanceOf[LogicalPlan]
  }

  protected def visitTableIdentifier(ctx: QualifiedNameContext): TableIdentifier = withOrigin(ctx) {
    ctx.identifier.asScala.toSeq match {
      case Seq(tbl) => TableIdentifier(tbl.getText)
      case Seq(db, tbl) => TableIdentifier(tbl.getText, Some(db.getText))
      case _ => throw new ParseException(s"Illegal table name ${ctx.getText}", ctx)
    }
  }

  override def visitPassThrough(ctx: PassThroughContext): LogicalPlan = null

  override def visitColTypeList(ctx: ColTypeListContext): Seq[StructField] = withOrigin(ctx) {
    ctx.colType().asScala.map(visitColType).toSeq
  }

  override def visitColType(ctx: ColTypeContext): StructField = withOrigin(ctx) {
    import ctx._

    val builder = new MetadataBuilder

    StructField(
      ctx.colName.getText,
      typedVisit[DataType](ctx.dataType),
      nullable = NOT == null,
      builder.build())
  }

  private def createUnresolvedTable(
      tableName: Seq[String],
      commandName: String): UnresolvedTable = {
    UnresolvedTable(tableName, commandName, relationTypeMismatchHint = None)
  }

  // Build the text of the CHECK constraint expression. The user-specified whitespace is in the
  // HIDDEN channel where we can't get to it, so we just paste together all the tokens with a single
  // space. This produces some strange spacing (e.g. `structCol . arr [ 0 ]`), but right now we
  // think that's preferable to the additional complexity involved in trying to produce cleaner
  // output.
  private def buildCheckConstraintText(tokens: Seq[ExprTokenContext]): String = {
    tokens.map(_.getText).mkString(" ")
  }

  private def extractRawText(exprContext: ParserRuleContext): String = {
    // Extract the raw expression which will be parsed later
    exprContext.getStart.getInputStream.getText(new Interval(
      exprContext.getStart.getStartIndex,
      exprContext.getStop.getStopIndex))
  }

  override def visitAddTableConstraint(
      ctx: AddTableConstraintContext): LogicalPlan = withOrigin(ctx) {
    val checkConstraint = ctx.constraint().asInstanceOf[CheckConstraintContext]

    AlterTableAddConstraint(
      createUnresolvedTable(ctx.table.identifier.asScala.map(_.getText).toSeq,
        "ALTER TABLE ... ADD CONSTRAINT"),
      ctx.name.getText,
      buildCheckConstraintText(checkConstraint.exprToken().asScala.toSeq))
  }

  override def visitDropTableConstraint(
      ctx: DropTableConstraintContext): LogicalPlan = withOrigin(ctx) {
    AlterTableDropConstraint(
      createUnresolvedTable(ctx.table.identifier.asScala.map(_.getText).toSeq,
        "ALTER TABLE ... DROP CONSTRAINT"),
      ctx.name.getText,
      ifExists = ctx.EXISTS != null)
  }

  protected def typedVisit[T](ctx: ParseTree): T = {
    ctx.accept(this).asInstanceOf[T]
  }

  override def visitPrimitiveDataType(ctx: PrimitiveDataTypeContext): DataType = withOrigin(ctx) {
    val dataType = ctx.identifier.getText.toLowerCase(Locale.ROOT)
    (dataType, ctx.INTEGER_VALUE().asScala.toList) match {
      case ("boolean", Nil) => BooleanType
      case ("tinyint" | "byte", Nil) => ByteType
      case ("smallint" | "short", Nil) => ShortType
      case ("int" | "integer", Nil) => IntegerType
      case ("bigint" | "long", Nil) => LongType
      case ("float", Nil) => FloatType
      case ("double", Nil) => DoubleType
      case ("date", Nil) => DateType
      case ("timestamp", Nil) => TimestampType
      case ("string", Nil) => StringType
      case ("char", length :: Nil) => CharType(length.getText.toInt)
      case ("varchar", length :: Nil) => VarcharType(length.getText.toInt)
      case ("binary", Nil) => BinaryType
      case ("decimal", Nil) => DecimalType.USER_DEFAULT
      case ("decimal", precision :: Nil) => DecimalType(precision.getText.toInt, 0)
      case ("decimal", precision :: scale :: Nil) =>
        DecimalType(precision.getText.toInt, scale.getText.toInt)
      case ("interval", Nil) => CalendarIntervalType
      case (dt, params) =>
        val dtStr = if (params.nonEmpty) s"$dt(${params.mkString(",")})" else dt
        throw new ParseException(s"DataType $dtStr is not supported.", ctx)
    }
  }
}

// scalastyle:off line.size.limit
/**
 * Fork from `org.apache.spark.sql.catalyst.parser.UpperCaseCharStream`.
 *
 * @see https://github.com/apache/spark/blob/v2.4.4/sql/catalyst/src/main/scala/org/apache/spark/sql/catalyst/parser/ParseDriver.scala#L157
 */
// scalastyle:on
class UpperCaseCharStream(wrapped: CodePointCharStream) extends CharStream {
  override def consume(): Unit = wrapped.consume
  override def getSourceName(): String = wrapped.getSourceName
  override def index(): Int = wrapped.index
  override def mark(): Int = wrapped.mark
  override def release(marker: Int): Unit = wrapped.release(marker)
  override def seek(where: Int): Unit = wrapped.seek(where)
  override def size(): Int = wrapped.size

  override def getText(interval: Interval): String = {
    // ANTLR 4.7's CodePointCharStream implementations have bugs when
    // getText() is called with an empty stream, or intervals where
    // the start > end. See
    // https://github.com/antlr/antlr4/commit/ac9f7530 for one fix
    // that is not yet in a released ANTLR artifact.
    if (size() > 0 && (interval.b - interval.a >= 0)) {
      wrapped.getText(interval)
    } else {
      ""
    }
  }

  override def LA(i: Int): Int = {
    val la = wrapped.LA(i)
    if (la == 0 || la == IntStream.EOF) la
    else Character.toUpperCase(la)
  }
}

// scalastyle:off line.size.limit
/**
 * Fork from `org.apache.spark.sql.catalyst.parser.PostProcessor`.
 *
 * @see https://github.com/apache/spark/blob/v2.4.4/sql/catalyst/src/main/scala/org/apache/spark/sql/catalyst/parser/ParseDriver.scala#L248
 */
// scalastyle:on
case object PostProcessor extends DeltaSqlBaseBaseListener {

  /** Remove the back ticks from an Identifier. */
  override def exitQuotedIdentifier(ctx: QuotedIdentifierContext): Unit = {
    replaceTokenByIdentifier(ctx, 1) { token =>
      // Remove the double back ticks in the string.
      token.setText(token.getText.replace("``", "`"))
      token
    }
  }

  /** Treat non-reserved keywords as Identifiers. */
  override def exitNonReserved(ctx: NonReservedContext): Unit = {
    replaceTokenByIdentifier(ctx, 0)(identity)
  }

  private def replaceTokenByIdentifier(
    ctx: ParserRuleContext,
    stripMargins: Int)(
    f: CommonToken => CommonToken = identity): Unit = {
    val parent = ctx.getParent
    parent.removeLastChild()
    val token = ctx.getChild(0).getPayload.asInstanceOf[Token]
    val newToken = new CommonToken(
      new org.antlr.v4.runtime.misc.Pair(token.getTokenSource, token.getInputStream),
      DeltaSqlBaseParser.IDENTIFIER,
      token.getChannel,
      token.getStartIndex + stripMargins,
      token.getStopIndex - stripMargins)
    parent.addChild(new TerminalNodeImpl(f(newToken)))
  }
}
