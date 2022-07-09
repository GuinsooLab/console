// This file is part of GuinsooLab Console Server
// Copyright (c) 2020-2022 GuinsooLab, Inc.
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

import React from "react";
import { Route, Routes } from "react-router-dom";
import FeatureNotAvailablePage from "../Common/Components/FeatureNotAvailablePage";
import { SupportMenuIcon } from "../../../icons/SidebarMenus";

import withSuspense from "../Common/Components/withSuspense";
import NotFoundPage from "../../NotFoundPage";

const Inspect = withSuspense(React.lazy(() => import("./Inspect")));
const Register = withSuspense(React.lazy(() => import("../Support/Register")));
const Profile = withSuspense(React.lazy(() => import("../Support/Profile")));

const Tools = () => {
  return (
    <Routes>
      <Route path={"register"} element={<Register />} />
      <Route path={"profile"} element={<Profile />} />
      <Route
        path={"call-home"}
        element={
          <FeatureNotAvailablePage
            icon={<SupportMenuIcon />}
            pageHeaderText={"Support"}
            title={"Call Home"}
            message={<div>This feature is currently not available.</div>}
          />
        }
      />
      <Route path={"inspect"} element={<Inspect />} />
      <Route path={"*"} element={<NotFoundPage />} />
    </Routes>
  );
};

export default Tools;
