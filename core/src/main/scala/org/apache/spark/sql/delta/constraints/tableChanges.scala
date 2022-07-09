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

package org.apache.spark.sql.delta.constraints

import org.apache.spark.sql.connector.catalog.TableChange

/**
 * Change to add a CHECK constraint to a table.
 *
 * @param constraintName The name of the new constraint. Note that constraint names are
 *                       case insensitive.
 * @param expr The expression to add, as a SQL parseable string.
 */
case class AddConstraint(constraintName: String, expr: String) extends TableChange {}

/**
 * Change to drop a constraint from a table. Note that this is always idempotent - no error
 * will be thrown if the constraint doesn't exist.
 *
 * @param constraintName the name of the constraint to drop - case insensitive
 * @param ifExists if false, throws an error if the constraint to be dropped does not exist
 */
case class DropConstraint(constraintName: String, ifExists: Boolean) extends TableChange {}
