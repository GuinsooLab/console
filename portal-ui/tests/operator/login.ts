// This file is part of GuinsooLab Console Server
// Copyright (c) 2022 GuinsooLab, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import * as roles from "../utils/roles";
import * as elements from "../utils/elements";
import { diagnosticsElement, supportElement } from "../utils/elements-menu";

fixture("For user with default permissions").page("http://localhost:9090");

test("Login to Operator Web Page", async (t) => {
  await t
    .navigateTo("http://localhost:9090/login")
    .typeText("#jwt", "anyrandompasswordwillwork")
    .click("button.MuiButton-root");
});
