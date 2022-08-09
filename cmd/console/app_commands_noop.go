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

//go:build !operator
// +build !operator

package main

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/GuinsooLab/console/pkg/logger"

	"github.com/GuinsooLab/console/restapi"
	"github.com/minio/cli"
)

var appCmds = []cli.Command{
	serverCmd,
	updateCmd,
}

// StartServer starts the console service
func StartServer(ctx *cli.Context) error {
	if err := loadAllCerts(ctx); err != nil {
		// Log this as a warning and continue running console without TLS certificates
		restapi.LogError("Unable to load certs: %v", err)
	}

	xctx := context.Background()
	transport := restapi.PrepareSTSClientTransport(false)
	if err := logger.InitializeLogger(xctx, transport); err != nil {
		fmt.Println("error InitializeLogger", err)
		logger.CriticalIf(xctx, err)
	}
	// custom error configuration
	restapi.LogInfo = logger.Info
	restapi.LogError = logger.Error
	restapi.LogIf = logger.LogIf

	var rctx restapi.Context
	if err := rctx.Load(ctx); err != nil {
		restapi.LogError("argument validation failed: %v", err)
		return err
	}

	server, err := buildServer()
	if err != nil {
		restapi.LogError("Unable to initialize console server: %v", err)
		return err
	}

	server.Host = rctx.Host
	server.Port = rctx.HTTPPort
	// set conservative timesout for uploads
	server.ReadTimeout = 1 * time.Hour
	// no timeouts for response for downloads
	server.WriteTimeout = 0
	restapi.Port = strconv.Itoa(server.Port)
	restapi.Hostname = server.Host

	if len(restapi.GlobalPublicCerts) > 0 {
		// If TLS certificates are provided enforce the HTTPS schema, meaning console will redirect
		// plain HTTP connections to HTTPS server
		server.EnabledListeners = []string{"http", "https"}
		server.TLSPort = rctx.HTTPSPort
		// Need to store tls-port, tls-host un config variables so secure.middleware can read from there
		restapi.TLSPort = strconv.Itoa(server.TLSPort)
		restapi.Hostname = rctx.Host
		restapi.TLSRedirect = rctx.TLSRedirect
	}

	defer server.Shutdown()

	return server.Serve()
}
