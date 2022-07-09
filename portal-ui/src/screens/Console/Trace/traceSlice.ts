// This file is part of MinIO Console Server
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

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TraceMessage } from "./types";

export interface TraceState {
  messages: TraceMessage[];
  traceStarted: boolean;
}

const initialState: TraceState = {
  messages: [],
  traceStarted: false,
};

export const traceSlice = createSlice({
  name: "trace",
  initialState,
  reducers: {
    traceMessageReceived: (state, action: PayloadAction<TraceMessage>) => {
      state.messages.push(action.payload);
    },
    traceResetMessages: (state) => {
      state.messages = [];
    },
    setTraceStarted: (state, action: PayloadAction<boolean>) => {
      state.traceStarted = action.payload;
    },
  },
});

export const { traceMessageReceived, traceResetMessages, setTraceStarted } =
  traceSlice.actions;

export default traceSlice.reducer;
