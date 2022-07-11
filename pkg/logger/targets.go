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

package logger

import (
	"sync"
	"sync/atomic"

	"github.com/minio/console/pkg/logger/target/http"
	"github.com/minio/console/pkg/logger/target/types"
)

// Target is the entity that we will receive
// a single log entry and Send it to the log target
//   e.g. Send the log to a http server
type Target interface {
	String() string
	Endpoint() string
	Init() error
	Cancel()
	Send(entry interface{}, errKind string) error
	Type() types.TargetType
}

var (
	// swapMu must be held while reading slice info or swapping targets or auditTargets.
	swapMu sync.Mutex

	// systemTargets is the set of enabled loggers.
	// Must be immutable at all times.
	// Can be swapped to another while holding swapMu
	systemTargets = []Target{}

	// This is always set represent /dev/console target
	consoleTgt Target

	nTargets int32 // atomic count of len(targets)
)

// SystemTargets returns active targets.
// Returned slice may not be modified in any way.
func SystemTargets() []Target {
	if atomic.LoadInt32(&nTargets) == 0 {
		// Lock free if none...
		return nil
	}
	swapMu.Lock()
	res := systemTargets
	swapMu.Unlock()
	return res
}

// AuditTargets returns active audit targets.
// Returned slice may not be modified in any way.
func AuditTargets() []Target {
	if atomic.LoadInt32(&nAuditTargets) == 0 {
		// Lock free if none...
		return nil
	}
	swapMu.Lock()
	res := auditTargets
	swapMu.Unlock()
	return res
}

// auditTargets is the list of enabled audit loggers
// Must be immutable at all times.
// Can be swapped to another while holding swapMu
var (
	auditTargets  = []Target{}
	nAuditTargets int32 // atomic count of len(auditTargets)
)

func cancelAllSystemTargets() {
	for _, tgt := range systemTargets {
		tgt.Cancel()
	}
}

func initSystemTargets(cfgMap map[string]http.Config) (tgts []Target, err error) {
	for _, l := range cfgMap {
		if l.Enabled {
			t := http.New(l)
			if err = t.Init(); err != nil {
				return tgts, err
			}
			tgts = append(tgts, t)
		}
	}
	return tgts, err
}

// UpdateSystemTargets swaps targets with newly loaded ones from the cfg
func UpdateSystemTargets(cfg Config) error {
	updated, err := initSystemTargets(cfg.HTTP)
	if err != nil {
		return err
	}

	swapMu.Lock()
	for _, tgt := range systemTargets {
		// Preserve console target when dynamically updating
		// other HTTP targets, console target is always present.
		if tgt.Type() == types.TargetConsole {
			updated = append(updated, tgt)
			break
		}
	}
	atomic.StoreInt32(&nTargets, int32(len(updated)))
	cancelAllSystemTargets() // cancel running targets
	systemTargets = updated
	swapMu.Unlock()
	return nil
}

func cancelAuditTargetType(t types.TargetType) {
	for _, tgt := range auditTargets {
		if tgt.Type() == t {
			tgt.Cancel()
		}
	}
}

// UpdateAuditWebhookTargets swaps audit webhook targets with newly loaded ones from the cfg
func UpdateAuditWebhookTargets(cfg Config) error {
	updated, err := initSystemTargets(cfg.AuditWebhook)
	if err != nil {
		return err
	}

	swapMu.Lock()
	atomic.StoreInt32(&nAuditTargets, int32(len(updated)))
	cancelAuditTargetType(types.TargetHTTP) // cancel running targets
	auditTargets = updated
	swapMu.Unlock()
	return nil
}
