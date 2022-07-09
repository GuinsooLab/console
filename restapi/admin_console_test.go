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

package restapi

import (
	"context"
	"encoding/json"
	"fmt"
	"testing"

	"github.com/minio/madmin-go"
	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioGetLogsMock func(ctx context.Context, node string, lineCnt int, logKind string) <-chan madmin.LogInfo

// mock function of listPolicies()
func (ac adminClientMock) getLogs(ctx context.Context, node string, lineCnt int, logKind string) <-chan madmin.LogInfo {
	return minioGetLogsMock(ctx, node, lineCnt, logKind)
}

func TestAdminConsoleLog(t *testing.T) {
	assert := assert.New(t)
	adminClient := adminClientMock{}
	mockWSConn := mockConn{}
	function := "startConsoleLog(ctx, )"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	testReceiver := make(chan madmin.LogInfo, 5)
	textToReceive := "test message"
	testStreamSize := 5
	isClosed := false // testReceiver is closed?

	// Test-1: Serve Console with no errors until Console finishes sending
	// define mock function behavior for minio server Console
	minioGetLogsMock = func(ctx context.Context, node string, lineCnt int, logKind string) <-chan madmin.LogInfo {
		ch := make(chan madmin.LogInfo)
		// Only success, start a routine to start reading line by line.
		go func(ch chan<- madmin.LogInfo) {
			defer close(ch)
			lines := make([]int, testStreamSize)
			// mocking sending 5 lines of info
			for range lines {
				info := madmin.LogInfo{
					ConsoleMsg: textToReceive,
				}
				ch <- info
			}
		}(ch)
		return ch
	}
	writesCount := 1
	// mock connection WriteMessage() no error
	connWriteMessageMock = func(messageType int, data []byte) error {
		// emulate that receiver gets the message written
		var t madmin.LogInfo
		_ = json.Unmarshal(data, &t)
		if writesCount == testStreamSize {
			if !isClosed {
				close(testReceiver)
				isClosed = true
			}
			return nil
		}
		testReceiver <- t
		writesCount++
		return nil
	}
	if err := startConsoleLog(ctx, mockWSConn, adminClient, LogRequest{node: "", logType: "all"}); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// check that the TestReceiver got the same number of data from Console.
	for i := range testReceiver {
		assert.Equal(textToReceive, i.ConsoleMsg)
	}

	// Test-2: if error happens while writing, return error
	connWriteMessageMock = func(messageType int, data []byte) error {
		return fmt.Errorf("error on write")
	}
	if err := startConsoleLog(ctx, mockWSConn, adminClient, LogRequest{node: "", logType: "all"}); assert.Error(err) {
		assert.Equal("error on write", err.Error())
	}

	// Test-3: error happens on GetLogs Minio, Console should stop
	// and error shall be returned.
	minioGetLogsMock = func(ctx context.Context, node string, lineCnt int, logKind string) <-chan madmin.LogInfo {
		ch := make(chan madmin.LogInfo)
		// Only success, start a routine to start reading line by line.
		go func(ch chan<- madmin.LogInfo) {
			defer close(ch)
			lines := make([]int, 2)
			// mocking sending 5 lines of info
			for range lines {
				info := madmin.LogInfo{
					ConsoleMsg: textToReceive,
				}
				ch <- info
			}
			ch <- madmin.LogInfo{Err: fmt.Errorf("error on Console")}
		}(ch)
		return ch
	}
	connWriteMessageMock = func(messageType int, data []byte) error {
		return nil
	}
	if err := startConsoleLog(ctx, mockWSConn, adminClient, LogRequest{node: "", logType: "all"}); assert.Error(err) {
		assert.Equal("error on Console", err.Error())
	}
}
