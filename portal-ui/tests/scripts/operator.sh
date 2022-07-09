# This file is part of MinIO Console Server
# Copyright (c) 2022 MinIO, Inc.
# # This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# # This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
# # You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

SCRIPT_DIR=$(dirname "$0")
export SCRIPT_DIR
source "${SCRIPT_DIR}/common.sh"

## this enables :dev tag for minio/operator container image.
CI="true"
export CI

## Make sure to install things if not present already
sudo curl -#L "https://dl.k8s.io/release/v1.23.1/bin/linux/amd64/kubectl" -o /usr/local/bin/kubectl
sudo chmod +x /usr/local/bin/kubectl

sudo curl -#L "https://dl.min.io/client/mc/release/linux-amd64/mc" -o /usr/local/bin/mc
sudo chmod +x /usr/local/bin/mc

yell() { echo "$0: $*" >&2; }

die() {
	yell "$*"
	(kind delete cluster || true ) && exit 111
}

try() { "$@" || die "cannot $*"; }

function setup_kind() {
	# TODO once feature is added: https://github.com/kubernetes-sigs/kind/issues/1300
	echo "kind: Cluster" > kind-config.yaml
	echo "apiVersion: kind.x-k8s.io/v1alpha4" >> kind-config.yaml
	echo "nodes:" >> kind-config.yaml
	echo "  - role: control-plane" >> kind-config.yaml
	echo "  - role: worker" >> kind-config.yaml
	echo "  - role: worker" >> kind-config.yaml
	echo "  - role: worker" >> kind-config.yaml
	echo "  - role: worker" >> kind-config.yaml
	try kind create cluster --config kind-config.yaml
	echo "Kind is ready"
	try kubectl get nodes
}

function install_operator() {

	echo "Installing Current Operator from kustomization.yaml"
	try kubectl apply -k "${SCRIPT_DIR}/resources"

	echo "key, value for pod selector in kustomize test"
	key=name
	value=minio-operator

	# Reusing the wait for both, Kustomize and Helm
	echo "Waiting for k8s api"
	sleep 10

	echo "wait for the app=console to be present -> One Pod"
	wait_for_resource minio-operator console app

	echo "wait for the name=minio-operator to be present -> Two Pods"
	wait_for_resource minio-operator $value $key

	echo "Waiting for Operator Pods to come online (3m timeout)"
	try kubectl wait --namespace minio-operator \
	--for=condition=ready pod \
	--selector $key=$value \
	--timeout=180s

	echo "start - get data to verify proper image is being used"
	kubectl get pods --namespace minio-operator
	kubectl describe pods -n minio-operator | grep Image
	echo "end - get data to verify proper image is being used"
}

function destroy_kind() {
	kind delete cluster
}

function wait_for_resource() {
	waitdone=0
	totalwait=0
	echo "command to wait on:"
	command_to_wait="kubectl -n $1 get pods -l $3=$2 --no-headers"
	echo $command_to_wait

	while true; do
	waitdone=$($command_to_wait | wc -l)
	if [ "$waitdone" -ne 0 ]; then
		echo "Found $waitdone pods"
			break
	fi
	sleep 5
	totalwait=$((totalwait + 5))
	if [ "$totalwait" -gt 305 ]; then
			echo "Unable to get resource after 5 minutes, exiting."
			try false
	fi
	done
}

function check_tenant_status() {
	# Check MinIO is accessible
	key=v1.min.io/tenant
	if [ $# -ge 3 ]; then
		echo "Third argument provided, then set key value"
		key=$3
	else
		echo "No third argument provided, using default key"
	fi

	wait_for_resource $1 $2 $key

	echo "Waiting for pods to be ready. (5m timeout)"

	if [ $# -ge 4 ]; then
		echo "Fourth argument provided, then get secrets from helm"
		USER=$(kubectl get secret minio1-secret -o jsonpath="{.data.accesskey}" | base64 --decode)
		PASSWORD=$(kubectl get secret minio1-secret -o jsonpath="{.data.secretkey}" | base64 --decode)
	else
		echo "No fourth argument provided, using default USER and PASSWORD"
		USER=$(kubectl -n $1 get secrets $2-env-configuration -o go-template='{{index .data "config.env"|base64decode }}' | grep 'export MINIO_ROOT_USER="' | sed -e 's/export MINIO_ROOT_USER="//g' | sed -e 's/"//g')
		PASSWORD=$(kubectl -n $1 get secrets $2-env-configuration -o go-template='{{index .data "config.env"|base64decode }}' | grep 'export MINIO_ROOT_PASSWORD="' | sed -e 's/export MINIO_ROOT_PASSWORD="//g' | sed -e 's/"//g')
	fi

	try kubectl wait --namespace $1 \
		--for=condition=ready pod \
		--selector=$key=$2 \
		--timeout=300s

	echo "Tenant is created successfully, proceeding to validate 'mc admin info minio/'"

	if [ "$4" = "helm" ]; then
		# File: operator/helm/tenant/values.yaml
		# Content: s3.bucketDNS: false
		echo "In helm values by default bucketDNS.s3 is disabled, skipping mc validation on helm test"
	else
		kubectl run admin-mc -i --tty --image minio/mc --command -- bash -c "until (mc alias set minio/ https://minio.$1.svc.cluster.local $USER $PASSWORD); do echo \"...waiting... for 5secs\" && sleep 5; done; mc admin info minio/;"
	fi

	echo "Done."
}

# Install tenant function is being used by deploy-tenant and check-prometheus
function install_tenant() {

	namespace=tenant-lite
	key=v1.min.io/tenant
	value=storage-lite
	echo "Installing lite tenant"

	try kubectl apply -k "${SCRIPT_DIR}/tenant-lite"

	echo "Waiting for the tenant statefulset, this indicates the tenant is being fulfilled"
	echo $namespace
	echo $value
	echo $key
	wait_for_resource $namespace $value $key

	echo "Waiting for tenant pods to come online (5m timeout)"
	try kubectl wait --namespace $namespace \
	--for=condition=ready pod \
	--selector $key=$value \
	--timeout=300s

	echo "Wait for Prometheus PVC to be bound"
	while [[ $(kubectl get pvc storage-lite-prometheus-storage-lite-prometheus-0 -n tenant-lite -o 'jsonpath={..status.phase}') != "Bound" ]]; do echo "waiting for PVC status" && sleep 1 && kubectl get pvc -A; done

	echo "Build passes basic tenant creation"

}

__init__() {
	export TIMESTAMP=$(date "+%s")
 	echo $TIMESTAMP > portal-ui/tests/constants/timestamp.txt
	export GOPATH=/tmp/gopath
	export PATH=${PATH}:${GOPATH}/bin
	destroy_kind
	setup_kind
	install_operator
	install_tenant
	echo "kubectl proxy"
	kubectl proxy &
	echo "yarn start"
	yarn start &
	echo "console operator"
	./console operator &
	echo "DONE with kind, yarn and console, next is testcafe"
	exit 0
}

( __init__ "$@")
