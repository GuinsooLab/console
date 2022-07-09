// This file is part of GuinsooLab Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import { notificationEndpointsElement } from "../utils/elements-menu";

fixture("For user with Notification Endpoints permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.notificationEndpoints);
  });

test("Notification Endpoints sidebar item exists", async (t) => {
  await t.expect(notificationEndpointsElement.exists).ok();
});

test("Add Notification Target button exists", async (t) => {
  const addNotifTargetButtonExists = elements.addNotifTargetButton.exists;
  await t
    .navigateTo("http://localhost:9090/settings/notification-endpoints")
    .expect(addNotifTargetButtonExists)
    .ok();
});

test("Add Notification Target button is clickable", async (t) => {
  await t
    .navigateTo("http://localhost:9090/settings/notification-endpoints")
    .click(elements.addNotifTargetButton);
});
