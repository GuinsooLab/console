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

package ssointegration

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"strings"
	"testing"
	"time"

	"github.com/GuinsooLab/console/restapi"
	"github.com/GuinsooLab/console/restapi/operations"
	"github.com/go-openapi/loads"
	"github.com/stretchr/testify/assert"
)

var token string

func initConsoleServer(consoleIDPURL string) (*restapi.Server, error) {
	// Configure Console Server with vars to get the idp config from the container
	os.Setenv("CONSOLE_IDP_URL", consoleIDPURL)
	os.Setenv("CONSOLE_IDP_CLIENT_ID", "minio-client-app")
	os.Setenv("CONSOLE_IDP_SECRET", "minio-client-app-secret")
	os.Setenv("CONSOLE_IDP_CALLBACK", "http://127.0.0.1:9090/oauth_callback")

	swaggerSpec, err := loads.Embedded(restapi.SwaggerJSON, restapi.FlatSwaggerJSON)
	if err != nil {
		return nil, err
	}

	noLog := func(string, ...interface{}) {
		// nothing to log
	}

	// Initialize MinIO loggers
	restapi.LogInfo = noLog
	restapi.LogError = noLog

	api := operations.NewConsoleAPI(swaggerSpec)
	api.Logger = noLog

	server := restapi.NewServer(api)
	// register all APIs
	server.ConfigureAPI()

	server.Host = "0.0.0.0"
	server.Port = 9090
	restapi.Port = "9090"
	restapi.Hostname = "0.0.0.0"

	return server, nil
}

func TestMain(t *testing.T) {
	assert := assert.New(t)

	// start console server
	go func() {
		fmt.Println("start server")
		srv, err := initConsoleServer("http://dex:5556/dex/.well-known/openid-configuration")
		if err != nil {
			log.Println(err)
			log.Println("init fail")
			return
		}
		srv.Serve()
	}()

	fmt.Println("sleeping")
	time.Sleep(2 * time.Second)

	client := &http.Client{
		Timeout: 2 * time.Second,
	}

	// Let's move this API here to increment our coverage
	getRequest, getError := http.NewRequest("GET", "http://localhost:9090/api/v1/login", nil)
	if getError != nil {
		log.Println(getError)
		return
	}
	getRequest.Header.Add("Content-Type", "application/json")
	getResponse, getErr := client.Do(getRequest)
	// current value:
	// {"loginStrategy":"form"}
	// but we want our console server to provide loginStrategy = redirect for SSO
	if getErr != nil {
		log.Println(getErr)
		return
	}

	body, err := io.ReadAll(getResponse.Body)
	getResponse.Body.Close()
	if getResponse.StatusCode > 299 {
		log.Fatalf("Response failed with status code: %d and\nbody: %s\n", getResponse.StatusCode, body)
	}
	if err != nil {
		log.Fatal(err)
	}
	var jsonMap map[string]interface{}
	json.Unmarshal(body, &jsonMap)
	fmt.Println(jsonMap["redirect"])
	redirect := jsonMap["redirect"]
	redirectAsString := fmt.Sprint(redirect)
	fmt.Println(redirectAsString)

	// execute script to get the code and state
	cmd, err := exec.Command("python3", "dex-requests.py", redirectAsString).Output()
	if err != nil {
		fmt.Printf("error %s", err)
	}
	urlOutput := string(cmd)
	requestLoginBody := bytes.NewReader([]byte("login=dillon%40example.io&password=dillon"))

	// parse url remove carriage return
	temp2 := strings.Split(urlOutput, "\n")
	fmt.Println("temp2: ", temp2)
	urlOutput = temp2[0] // remove carriage return to avoid invalid control character in url

	// validate url
	urlParseResult, urlParseError := url.Parse(urlOutput)
	if urlParseError != nil {
		panic(urlParseError)
	}
	fmt.Println(urlParseResult)

	// prepare for post
	httpRequestLogin, newRequestError := http.NewRequest(
		"POST",
		urlOutput,
		requestLoginBody,
	)
	fmt.Println(newRequestError)
	httpRequestLogin.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	responseLogin, errorLogin := client.Do(httpRequestLogin)
	if errorLogin != nil {
		log.Println(errorLogin)
	}
	rawQuery := responseLogin.Request.URL.RawQuery
	fmt.Println(rawQuery)
	splitRawQuery := strings.Split(rawQuery, "&state=")
	codeValue := strings.ReplaceAll(splitRawQuery[0], "code=", "")
	stateValue := splitRawQuery[1]
	fmt.Println("stop", splitRawQuery, codeValue, stateValue)

	// get login credentials
	codeVarIable := strings.TrimSpace(codeValue)
	stateVarIabl := strings.TrimSpace(stateValue)
	requestData := map[string]string{
		"code":  codeVarIable,
		"state": stateVarIabl,
	}
	requestDataJSON, _ := json.Marshal(requestData)

	requestDataBody := bytes.NewReader(requestDataJSON)

	request, _ := http.NewRequest(
		"POST",
		"http://localhost:9090/api/v1/login/oauth2/auth",
		requestDataBody,
	)
	request.Header.Add("Content-Type", "application/json")

	response, err := client.Do(request)
	if err != nil {
		log.Println(err)
	}
	if response != nil {
		for _, cookie := range response.Cookies() {
			if cookie.Name == "token" {
				token = cookie.Value
				break
			}
		}
	}
	fmt.Println(response.Status)
	if token == "" {
		assert.Fail("authentication token not found in cookies response")
	} else {
		fmt.Println(token)
	}
}

func TestBadLogin(t *testing.T) {
	assert := assert.New(t)

	// start console server
	go func() {
		fmt.Println("start server")
		srv, err := initConsoleServer("http://dex:5556")
		if err != nil {
			log.Println(err)
			log.Println("init fail")
			return
		}
		srv.Serve()
	}()
	fmt.Println("sleeping")
	time.Sleep(2 * time.Second)

	client := &http.Client{
		Timeout: 2 * time.Second,
	}

	// get login credentials
	codeVarIable := "invalidCode"
	stateVarIabl := "invalidState"
	requestData := map[string]string{
		"code":  codeVarIable,
		"state": stateVarIabl,
	}
	requestDataJSON, _ := json.Marshal(requestData)

	requestDataBody := bytes.NewReader(requestDataJSON)

	request, _ := http.NewRequest(
		"POST",
		"http://localhost:9090/api/v1/login/oauth2/auth",
		requestDataBody,
	)
	request.Header.Add("Content-Type", "application/json")

	response, err := client.Do(request)
	fmt.Println(response)
	fmt.Println(err)
	expectedError := response.Status
	assert.Equal("500 Internal Server Error", expectedError)
}
