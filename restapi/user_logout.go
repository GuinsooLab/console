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
	"net/http"

	"github.com/GuinsooLab/console/models"
	"github.com/GuinsooLab/console/restapi/operations"
	authApi "github.com/GuinsooLab/console/restapi/operations/auth"
	"github.com/go-openapi/runtime"
	"github.com/go-openapi/runtime/middleware"
)

func registerLogoutHandlers(api *operations.ConsoleAPI) {
	// logout from console
	api.AuthLogoutHandler = authApi.LogoutHandlerFunc(func(params authApi.LogoutParams, session *models.Principal) middleware.Responder {
		getLogoutResponse(session)
		// Custom response writer to expire the session cookies
		return middleware.ResponderFunc(func(w http.ResponseWriter, p runtime.Producer) {
			expiredCookie := ExpireSessionCookie()
			// this will tell the browser to clear the cookie and invalidate user session
			// additionally we are deleting the cookie from the client side
			http.SetCookie(w, &expiredCookie)
			authApi.NewLogoutOK().WriteResponse(w, p)
		})
	})
}

// logout() call Expire() on the provided ConsoleCredentials
func logout(credentials ConsoleCredentialsI) {
	credentials.Expire()
}

// getLogoutResponse performs logout() and returns nil or errors
func getLogoutResponse(session *models.Principal) {
	creds := getConsoleCredentialsFromSession(session)
	credentials := ConsoleCredentials{ConsoleCredentials: creds}
	logout(credentials)
}
