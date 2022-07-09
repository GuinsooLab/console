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

package operatorapi

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io"
	"io/ioutil"
	"net/http"
	"reflect"
	"testing"
	"time"

	xhttp "github.com/minio/console/pkg/http"

	"github.com/minio/console/operatorapi/operations/operator_api"

	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	miniov2 "github.com/minio/operator/pkg/apis/minio.min.io/v2"
	corev1 "k8s.io/api/core/v1"
	k8sErrors "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	types "k8s.io/apimachinery/pkg/types"
	"k8s.io/client-go/kubernetes/fake"
)

var (
	opClientTenantDeleteMock func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error
	opClientTenantGetMock    func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error)
	opClientTenantPatchMock  func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error)
	opClientTenantUpdateMock func(ctx context.Context, tenant *miniov2.Tenant, opts metav1.UpdateOptions) (*miniov2.Tenant, error)
)

var (
	opClientTenantListMock  func(ctx context.Context, namespace string, opts metav1.ListOptions) (*miniov2.TenantList, error)
	httpClientGetMock       func(url string) (resp *http.Response, err error)
	httpClientPostMock      func(url, contentType string, body io.Reader) (resp *http.Response, err error)
	httpClientDoMock        func(req *http.Request) (*http.Response, error)
	k8sclientGetSecretMock  func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error)
	k8sclientGetServiceMock func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error)
)

// mock function of TenantDelete()
func (ac opClientMock) TenantDelete(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
	return opClientTenantDeleteMock(ctx, namespace, tenantName, options)
}

// mock function of TenantGet()
func (ac opClientMock) TenantGet(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
	return opClientTenantGetMock(ctx, namespace, tenantName, options)
}

// mock function of TenantPatch()
func (ac opClientMock) TenantPatch(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error) {
	return opClientTenantPatchMock(ctx, namespace, tenantName, pt, data, options)
}

// mock function of TenantUpdate()
func (ac opClientMock) TenantUpdate(ctx context.Context, tenant *miniov2.Tenant, opts metav1.UpdateOptions) (*miniov2.Tenant, error) {
	return opClientTenantUpdateMock(ctx, tenant, opts)
}

// mock function of TenantList()
func (ac opClientMock) TenantList(ctx context.Context, namespace string, opts metav1.ListOptions) (*miniov2.TenantList, error) {
	return opClientTenantListMock(ctx, namespace, opts)
}

// mock function of get()
func (h httpClientMock) Get(url string) (resp *http.Response, err error) {
	return httpClientGetMock(url)
}

// mock function of post()
func (h httpClientMock) Post(url, contentType string, body io.Reader) (resp *http.Response, err error) {
	return httpClientPostMock(url, contentType, body)
}

// mock function of Do()
func (h httpClientMock) Do(req *http.Request) (*http.Response, error) {
	return httpClientDoMock(req)
}

func (c k8sClientMock) getSecret(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
	return k8sclientGetSecretMock(ctx, namespace, secretName, opts)
}

func (c k8sClientMock) getService(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error) {
	return k8sclientGetServiceMock(ctx, namespace, serviceName, opts)
}

func Test_TenantInfoTenantAdminClient(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	kClient := k8sClientMock{}
	type args struct {
		ctx        context.Context
		client     K8sClientI
		tenant     miniov2.Tenant
		serviceURL string
	}
	tests := []struct {
		name           string
		args           args
		wantErr        bool
		mockGetSecret  func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error)
		mockGetService func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error)
	}{
		{
			name: "Return Tenant Admin, no errors",
			args: args{
				ctx:    ctx,
				client: kClient,
				tenant: miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Namespace: "default",
						Name:      "tenant-1",
					},
					Spec: miniov2.TenantSpec{CredsSecret: &corev1.LocalObjectReference{Name: "secret-name"}},
				},
				serviceURL: "http://service-1.default.svc.cluster.local:80",
			},
			mockGetSecret: func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
				vals := make(map[string][]byte)
				vals["secretkey"] = []byte("secret")
				vals["accesskey"] = []byte("access")
				sec := &corev1.Secret{
					Data: vals,
				}
				return sec, nil
			},
			mockGetService: func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error) {
				serv := &corev1.Service{
					Spec: corev1.ServiceSpec{
						ClusterIP: "10.1.1.2",
					},
				}
				return serv, nil
			},
			wantErr: false,
		},
		{
			name: "Access key not stored on secrets",
			args: args{
				ctx:    ctx,
				client: kClient,
				tenant: miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Namespace: "default",
						Name:      "tenant-1",
					},
				},
				serviceURL: "http://service-1.default.svc.cluster.local:80",
			},
			mockGetSecret: func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
				vals := make(map[string][]byte)
				vals["secretkey"] = []byte("secret")
				sec := &corev1.Secret{
					Data: vals,
				}
				return sec, nil
			},
			mockGetService: func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error) {
				serv := &corev1.Service{
					Spec: corev1.ServiceSpec{
						ClusterIP: "10.1.1.2",
					},
				}
				return serv, nil
			},
			wantErr: true,
		},
		{
			name: "Secret key not stored on secrets",
			args: args{
				ctx:    ctx,
				client: kClient,
				tenant: miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Namespace: "default",
						Name:      "tenant-1",
					},
				},
				serviceURL: "http://service-1.default.svc.cluster.local:80",
			},
			mockGetSecret: func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
				vals := make(map[string][]byte)
				vals["accesskey"] = []byte("access")
				sec := &corev1.Secret{
					Data: vals,
				}
				return sec, nil
			},
			mockGetService: func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error) {
				serv := &corev1.Service{
					Spec: corev1.ServiceSpec{
						ClusterIP: "10.1.1.2",
					},
				}
				return serv, nil
			},
			wantErr: true,
		},
		{
			name: "Handle error on getService",
			args: args{
				ctx:    ctx,
				client: kClient,
				tenant: miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Namespace: "default",
						Name:      "tenant-1",
					},
				},
				serviceURL: "http://service-1.default.svc.cluster.local:80",
			},
			mockGetSecret: func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
				vals := make(map[string][]byte)
				vals["accesskey"] = []byte("access")
				vals["secretkey"] = []byte("secret")
				sec := &corev1.Secret{
					Data: vals,
				}
				return sec, nil
			},
			mockGetService: func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error) {
				return nil, errors.New("error")
			},
			wantErr: true,
		},
		{
			name: "Handle error on getSecret",
			args: args{
				ctx:    ctx,
				client: kClient,
				tenant: miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Namespace: "default",
						Name:      "tenant-1",
					},
				},
				serviceURL: "http://service-1.default.svc.cluster.local:80",
			},
			mockGetSecret: func(ctx context.Context, namespace, secretName string, opts metav1.GetOptions) (*corev1.Secret, error) {
				return nil, errors.New("error")
			},
			mockGetService: func(ctx context.Context, namespace, serviceName string, opts metav1.GetOptions) (*corev1.Service, error) {
				serv := &corev1.Service{
					Spec: corev1.ServiceSpec{
						ClusterIP: "10.1.1.2",
					},
				}
				return serv, nil
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		k8sclientGetSecretMock = tt.mockGetSecret
		k8sclientGetServiceMock = tt.mockGetService
		t.Run(tt.name, func(t *testing.T) {
			got, err := getTenantAdminClient(tt.args.ctx, tt.args.client, &tt.args.tenant, tt.args.serviceURL)
			if err != nil {
				if tt.wantErr {
					return
				}
				t.Errorf("getTenantAdminClient() error = %v, wantErr %v", err, tt.wantErr)
			}
			if got == nil {
				t.Errorf("getTenantAdminClient() expected type: *madmin.AdminClient, got: nil")
			}
		})
	}
}

func NoTestTenantInfo(t *testing.T) {
	testTimeStamp := metav1.Now()
	type args struct {
		minioTenant *miniov2.Tenant
	}
	tests := []struct {
		name string
		args args
		want *models.Tenant
	}{
		{
			name: "Get tenant Info",
			args: args{
				minioTenant: &miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						CreationTimestamp: testTimeStamp,
						Name:              "tenant1",
						Namespace:         "minio-ns",
					},
					Spec: miniov2.TenantSpec{
						Pools: []miniov2.Pool{
							{
								Name:             "pool1",
								Servers:          int32(2),
								VolumesPerServer: 4,
								VolumeClaimTemplate: &corev1.PersistentVolumeClaim{
									Spec: corev1.PersistentVolumeClaimSpec{
										Resources: corev1.ResourceRequirements{
											Requests: map[corev1.ResourceName]resource.Quantity{
												corev1.ResourceStorage: resource.MustParse("1Mi"),
											},
										},
										StorageClassName: swag.String("standard"),
									},
								},
							},
						},

						Image: "minio/minio:RELEASE.2020-06-14T18-32-17Z",
					},
					Status: miniov2.TenantStatus{
						CurrentState: "ready",
					},
				},
			},
			want: &models.Tenant{
				CreationDate: testTimeStamp.Format(time.RFC3339),
				Name:         "tenant1",
				TotalSize:    int64(8388608),
				CurrentState: "ready",
				Pools: []*models.Pool{
					{
						Name:             "pool1",
						Servers:          swag.Int64(int64(2)),
						VolumesPerServer: swag.Int32(4),
						VolumeConfiguration: &models.PoolVolumeConfiguration{
							StorageClassName: "standard",
							Size:             swag.Int64(1024 * 1024),
						},
					},
				},
				Namespace:        "minio-ns",
				Image:            "minio/minio:RELEASE.2020-06-14T18-32-17Z",
				EnablePrometheus: false,
			},
		},
		{
			// Description if DeletionTimeStamp is present, value should be returned as string
			// If Prometheus annotations are present, EnablePrometheus should be returned as true
			// All three annotations should be defined to consider Prometheus enabled
			name: "Get tenant Info w DeletionTimeStamp and Prometheus",
			args: args{
				minioTenant: &miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						CreationTimestamp: testTimeStamp,
						Name:              "tenant1",
						Namespace:         "minio-ns",
						DeletionTimestamp: &testTimeStamp,
						Annotations: map[string]string{
							prometheusPath:   "some/path",
							prometheusPort:   "other/path",
							prometheusScrape: "other/path",
						},
					},
					Spec: miniov2.TenantSpec{
						Pools: []miniov2.Pool{
							{
								Name:             "pool1",
								Servers:          int32(2),
								VolumesPerServer: 4,
								VolumeClaimTemplate: &corev1.PersistentVolumeClaim{
									Spec: corev1.PersistentVolumeClaimSpec{
										Resources: corev1.ResourceRequirements{
											Requests: map[corev1.ResourceName]resource.Quantity{
												corev1.ResourceStorage: resource.MustParse("1Mi"),
											},
										},
										StorageClassName: swag.String("standard"),
									},
								},
							},
						},
						Image: "minio/minio:RELEASE.2020-06-14T18-32-17Z",
					},
					Status: miniov2.TenantStatus{
						CurrentState: "ready",
					},
				},
			},
			want: &models.Tenant{
				CreationDate: testTimeStamp.Format(time.RFC3339),
				DeletionDate: testTimeStamp.Format(time.RFC3339),
				Name:         "tenant1",
				TotalSize:    int64(8388608),
				CurrentState: "ready",
				Pools: []*models.Pool{
					{
						Name:             "pool1",
						Servers:          swag.Int64(int64(2)),
						VolumesPerServer: swag.Int32(4),
						VolumeConfiguration: &models.PoolVolumeConfiguration{
							StorageClassName: "standard",
							Size:             swag.Int64(1024 * 1024),
						},
					},
				},
				Namespace:        "minio-ns",
				Image:            "minio/minio:RELEASE.2020-06-14T18-32-17Z",
				EnablePrometheus: true,
			},
		},
		{
			// If Prometheus annotations are present, EnablePrometheus should be returned as true
			// All three annotations should be defined to consider Prometheus enabled
			name: "Get tenant Info, not all Prometheus annotations",
			args: args{
				minioTenant: &miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						CreationTimestamp: testTimeStamp,
						Name:              "tenant1",
						Namespace:         "minio-ns",
						Annotations: map[string]string{
							prometheusPath:   "some/path",
							prometheusScrape: "other/path",
						},
					},
					Spec: miniov2.TenantSpec{
						Pools: []miniov2.Pool{},
						Image: "minio/minio:RELEASE.2020-06-14T18-32-17Z",
					},
					Status: miniov2.TenantStatus{
						CurrentState: "ready",
					},
				},
			},
			want: &models.Tenant{
				CreationDate:     testTimeStamp.Format(time.RFC3339),
				Name:             "tenant1",
				CurrentState:     "ready",
				Namespace:        "minio-ns",
				Image:            "minio/minio:RELEASE.2020-06-14T18-32-17Z",
				EnablePrometheus: false,
			},
		},
		{
			// If console image is set, it should be returned on tenant info
			name: "Get tenant Info, Console image set",
			args: args{
				minioTenant: &miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						CreationTimestamp: testTimeStamp,
						Name:              "tenant1",
						Namespace:         "minio-ns",
						Annotations: map[string]string{
							prometheusPath:   "some/path",
							prometheusScrape: "other/path",
						},
					},
					Spec: miniov2.TenantSpec{
						Pools: []miniov2.Pool{},
						Image: "minio/minio:RELEASE.2020-06-14T18-32-17Z",
					},
					Status: miniov2.TenantStatus{
						CurrentState: "ready",
					},
				},
			},
			want: &models.Tenant{
				CreationDate:     testTimeStamp.Format(time.RFC3339),
				Name:             "tenant1",
				CurrentState:     "ready",
				Namespace:        "minio-ns",
				Image:            "minio/minio:RELEASE.2020-06-14T18-32-17Z",
				EnablePrometheus: false,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := getTenantInfo(tt.args.minioTenant)
			if !reflect.DeepEqual(got, tt.want) {
				ji, _ := json.Marshal(got)
				vi, _ := json.Marshal(tt.want)
				t.Errorf("got %s want %s", ji, vi)
			}
		})
	}
}

func Test_deleteTenantAction(t *testing.T) {
	opClient := opClientMock{}
	type args struct {
		ctx              context.Context
		operatorClient   OperatorClientI
		tenant           *miniov2.Tenant
		deletePvcs       bool
		objs             []runtime.Object
		mockTenantDelete func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "Success",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				tenant: &miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "default",
						Namespace: "minio-tenant",
					},
				},
				deletePvcs: false,
				mockTenantDelete: func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
					return nil
				},
			},
			wantErr: false,
		},
		{
			name: "Error",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				tenant: &miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "default",
						Namespace: "minio-tenant",
					},
				},
				deletePvcs: false,
				mockTenantDelete: func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
					return errors.New("something happened")
				},
			},
			wantErr: true,
		},
		{
			// Delete only PVCs of the defined tenant on the specific namespace
			name: "Delete PVCs on Tenant Deletion",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				tenant: &miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "tenant1",
						Namespace: "minio-tenant",
					},
				},
				deletePvcs: true,
				objs: []runtime.Object{
					&corev1.PersistentVolumeClaim{
						ObjectMeta: metav1.ObjectMeta{
							Name:      "PVC1",
							Namespace: "minio-tenant",
							Labels: map[string]string{
								miniov2.TenantLabel: "tenant1",
								miniov2.PoolLabel:   "pool-1",
							},
						},
					},
				},
				mockTenantDelete: func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
					return nil
				},
			},
			wantErr: false,
		},
		{
			// Do not delete underlying pvcs
			name: "Don't Delete PVCs on Tenant Deletion",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				tenant: &miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "tenant1",
						Namespace: "minio-tenant",
					},
				},
				deletePvcs: false,
				objs: []runtime.Object{
					&corev1.PersistentVolumeClaim{
						ObjectMeta: metav1.ObjectMeta{
							Name:      "PVC1",
							Namespace: "minio-tenant",
							Labels: map[string]string{
								miniov2.TenantLabel: "tenant1",
								miniov2.PoolLabel:   "pool-1",
							},
						},
					},
				},
				mockTenantDelete: func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
					return nil
				},
			},
			wantErr: false,
		},
		{
			// If error is different than NotFound, PVC deletion should not continue
			name: "Don't delete pvcs if error Deleting Tenant, return",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				tenant: &miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "tenant1",
						Namespace: "minio-tenant",
					},
				},
				deletePvcs: true,
				objs: []runtime.Object{
					&corev1.PersistentVolumeClaim{
						ObjectMeta: metav1.ObjectMeta{
							Name:      "PVC1",
							Namespace: "minio-tenant",
							Labels: map[string]string{
								miniov2.TenantLabel: "tenant1",
								miniov2.PoolLabel:   "pool-1",
							},
						},
					},
				},
				mockTenantDelete: func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
					return errors.New("error returned")
				},
			},
			wantErr: true,
		},
		{
			// If error is NotFound while trying to Delete Tenant, PVC deletion should continue
			name: "Delete pvcs if tenant not found",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				tenant: &miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "tenant1",
						Namespace: "minio-tenant",
					},
				},
				deletePvcs: true,
				objs: []runtime.Object{
					&corev1.PersistentVolumeClaim{
						ObjectMeta: metav1.ObjectMeta{
							Name:      "PVC1",
							Namespace: "minio-tenant",
							Labels: map[string]string{
								miniov2.TenantLabel: "tenant1",
								miniov2.PoolLabel:   "pool-1",
							},
						},
					},
				},
				mockTenantDelete: func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
					return k8sErrors.NewNotFound(schema.GroupResource{}, "tenant1")
				},
			},
			wantErr: false,
		},
		{
			// If error is NotFound while trying to Delete Tenant and pvcdeletion=false,
			// error should be returned
			name: "Don't delete pvcs and return error if tenant not found",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				tenant: &miniov2.Tenant{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "tenant1",
						Namespace: "minio-tenant",
					},
				},
				deletePvcs: false,
				objs: []runtime.Object{
					&corev1.PersistentVolumeClaim{
						ObjectMeta: metav1.ObjectMeta{
							Name:      "PVC1",
							Namespace: "minio-tenant",
							Labels: map[string]string{
								miniov2.TenantLabel: "tenant1",
								miniov2.PoolLabel:   "pool-1",
							},
						},
					},
				},
				mockTenantDelete: func(ctx context.Context, namespace string, tenantName string, options metav1.DeleteOptions) error {
					return k8sErrors.NewNotFound(schema.GroupResource{}, "tenant1")
				},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		opClientTenantDeleteMock = tt.args.mockTenantDelete
		kubeClient := fake.NewSimpleClientset(tt.args.objs...)
		t.Run(tt.name, func(t *testing.T) {
			if err := deleteTenantAction(tt.args.ctx, tt.args.operatorClient, kubeClient.CoreV1(), tt.args.tenant, tt.args.deletePvcs); (err != nil) != tt.wantErr {
				t.Errorf("deleteTenantAction() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func Test_TenantAddPool(t *testing.T) {
	opClient := opClientMock{}

	type args struct {
		ctx             context.Context
		operatorClient  OperatorClientI
		nameSpace       string
		mockTenantPatch func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error)
		mockTenantGet   func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error)
		params          operator_api.TenantAddPoolParams
	}
	tests := []struct {
		name    string
		args    args
		wantErr bool
	}{
		{
			name: "Add pool, no errors",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				params: operator_api.TenantAddPoolParams{
					Body: &models.Pool{
						Name:    "pool-1",
						Servers: swag.Int64(int64(4)),
						VolumeConfiguration: &models.PoolVolumeConfiguration{
							Size:             swag.Int64(2147483648),
							StorageClassName: "standard",
						},
						VolumesPerServer: swag.Int32(4),
					},
				},
			},
			wantErr: false,
		},
		{
			name: "Add pool, error size",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				params: operator_api.TenantAddPoolParams{
					Body: &models.Pool{
						Name:    "pool-1",
						Servers: swag.Int64(int64(4)),
						VolumeConfiguration: &models.PoolVolumeConfiguration{
							Size:             swag.Int64(0),
							StorageClassName: "standard",
						},
						VolumesPerServer: swag.Int32(4),
					},
				},
			},
			wantErr: true,
		},
		{
			name: "Add pool, error servers negative",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				params: operator_api.TenantAddPoolParams{
					Body: &models.Pool{
						Name:    "pool-1",
						Servers: swag.Int64(int64(-1)),
						VolumeConfiguration: &models.PoolVolumeConfiguration{
							Size:             swag.Int64(2147483648),
							StorageClassName: "standard",
						},
						VolumesPerServer: swag.Int32(4),
					},
				},
			},
			wantErr: true,
		},
		{
			name: "Add pool, error volumes per server negative",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				params: operator_api.TenantAddPoolParams{
					Body: &models.Pool{
						Name:    "pool-1",
						Servers: swag.Int64(int64(4)),
						VolumeConfiguration: &models.PoolVolumeConfiguration{
							Size:             swag.Int64(2147483648),
							StorageClassName: "standard",
						},
						VolumesPerServer: swag.Int32(-1),
					},
				},
			},
			wantErr: true,
		},
		{
			name: "Error on patch, handle error",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error) {
					return nil, errors.New("errors")
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				params: operator_api.TenantAddPoolParams{
					Body: &models.Pool{
						Name:    "pool-1",
						Servers: swag.Int64(int64(4)),
					},
				},
			},
			wantErr: true,
		},
		{
			name: "Error on get, handle error",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error) {
					return nil, errors.New("errors")
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					return nil, errors.New("errors")
				},
				params: operator_api.TenantAddPoolParams{
					Body: &models.Pool{
						Name:    "pool-1",
						Servers: swag.Int64(int64(4)),
					},
				},
			},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		opClientTenantGetMock = tt.args.mockTenantGet
		opClientTenantPatchMock = tt.args.mockTenantPatch
		t.Run(tt.name, func(t *testing.T) {
			if err := addTenantPool(tt.args.ctx, tt.args.operatorClient, tt.args.params); (err != nil) != tt.wantErr {
				t.Errorf("addTenantPool() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func Test_UpdateTenantAction(t *testing.T) {
	opClient := opClientMock{}
	httpClientM := httpClientMock{}

	type args struct {
		ctx               context.Context
		operatorClient    OperatorClientI
		httpCl            xhttp.ClientI
		nameSpace         string
		tenantName        string
		mockTenantPatch   func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error)
		mockTenantGet     func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error)
		mockHTTPClientGet func(url string) (resp *http.Response, err error)
		params            operator_api.UpdateTenantParams
	}
	tests := []struct {
		name    string
		args    args
		objs    []runtime.Object
		wantErr bool
	}{
		{
			name: "Update minio version no errors",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					return &http.Response{}, nil
				},
				params: operator_api.UpdateTenantParams{
					Body: &models.UpdateTenantRequest{
						Image: "minio/minio:RELEASE.2020-06-03T22-13-49Z",
					},
				},
			},
			wantErr: false,
		},
		{
			name: "Error occurs getting minioTenant",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					return nil, errors.New("error-get")
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					return &http.Response{}, nil
				},
				params: operator_api.UpdateTenantParams{
					Body: &models.UpdateTenantRequest{
						Image: "minio/minio:RELEASE.2020-06-03T22-13-49Z",
					},
				},
			},
			wantErr: true,
		},
		{
			name: "Error occurs patching minioTenant",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error) {
					return nil, errors.New("error-get")
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					return &http.Response{}, nil
				},
				params: operator_api.UpdateTenantParams{
					Tenant: "minio-tenant",
					Body: &models.UpdateTenantRequest{
						Image: "minio/minio:RELEASE.2020-06-03T22-13-49Z",
					},
				},
			},
			wantErr: true,
		},
		{
			name: "Empty image should patch correctly with latest image",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					r := ioutil.NopCloser(bytes.NewReader([]byte(`./minio.RELEASE.2020-06-18T02-23-35Z"`)))
					return &http.Response{
						Body: r,
					}, nil
				},
				params: operator_api.UpdateTenantParams{
					Tenant: "minio-tenant",
					Body: &models.UpdateTenantRequest{
						Image: "",
					},
				},
			},
			wantErr: false,
		},
		{
			name: "Empty image input Error retrieving latest image, nothing happens",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					return nil, errors.New("error")
				},
				params: operator_api.UpdateTenantParams{
					Tenant: "minio-tenant",
					Body: &models.UpdateTenantRequest{
						Image: "",
					},
				},
			},
			wantErr: false,
		},
		{
			name: "Update minio image pull secrets no errors",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				httpCl:         httpClientM,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantPatch: func(ctx context.Context, namespace string, tenantName string, pt types.PatchType, data []byte, options metav1.PatchOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockHTTPClientGet: func(url string) (resp *http.Response, err error) {
					return nil, errors.New("use default minio")
				},
				params: operator_api.UpdateTenantParams{
					Body: &models.UpdateTenantRequest{
						ImagePullSecret: "minio-regcred",
					},
				},
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		opClientTenantGetMock = tt.args.mockTenantGet
		opClientTenantPatchMock = tt.args.mockTenantPatch
		httpClientGetMock = tt.args.mockHTTPClientGet
		cnsClient := fake.NewSimpleClientset(tt.objs...)
		t.Run(tt.name, func(t *testing.T) {
			if err := updateTenantAction(tt.args.ctx, tt.args.operatorClient, cnsClient.CoreV1(), tt.args.httpCl, tt.args.nameSpace, tt.args.params); (err != nil) != tt.wantErr {
				t.Errorf("updateTenantAction() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func Test_UpdateDomainsResponse(t *testing.T) {
	opClient := opClientMock{}

	type args struct {
		ctx              context.Context
		operatorClient   OperatorClientI
		nameSpace        string
		tenantName       string
		mockTenantUpdate func(ctx context.Context, tenant *miniov2.Tenant, options metav1.UpdateOptions) (*miniov2.Tenant, error)
		mockTenantGet    func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error)
		domains          *models.DomainsConfiguration
	}
	tests := []struct {
		name    string
		args    args
		objs    []runtime.Object
		wantErr bool
	}{
		{
			name: "Update console & minio domains OK",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantUpdate: func(ctx context.Context, tenant *miniov2.Tenant, options metav1.UpdateOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				domains: &models.DomainsConfiguration{
					Console: "http://console.min.io",
					Minio:   []string{"http://domain1.min.io", "http://domain2.min.io", "http://domain3.min.io"},
				},
			},
			wantErr: false,
		},
		{
			name: "Error occurs getting minioTenant",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantUpdate: func(ctx context.Context, tenant *miniov2.Tenant, options metav1.UpdateOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					return nil, errors.New("error-getting-tenant-info")
				},
				domains: &models.DomainsConfiguration{
					Console: "http://console.min.io",
					Minio:   []string{"http://domain1.min.io", "http://domain2.min.io", "http://domain3.min.io"},
				},
			},
			wantErr: true,
		},
		{
			name: "Tenant already has domains",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantUpdate: func(ctx context.Context, tenant *miniov2.Tenant, options metav1.UpdateOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					domains := miniov2.TenantDomains{
						Console: "http://onerandomdomain.min.io",
						Minio: []string{
							"http://oneDomain.min.io",
							"http://twoDomains.min.io",
						},
					}

					features := miniov2.Features{
						Domains: &domains,
					}

					return &miniov2.Tenant{
						Spec: miniov2.TenantSpec{Features: &features},
					}, nil
				},
				domains: &models.DomainsConfiguration{
					Console: "http://console.min.io",
					Minio:   []string{"http://domain1.min.io", "http://domain2.min.io", "http://domain3.min.io"},
				},
			},
			wantErr: false,
		},
		{
			name: "Tenant features only have BucketDNS",
			args: args{
				ctx:            context.Background(),
				operatorClient: opClient,
				nameSpace:      "default",
				tenantName:     "minio-tenant",
				mockTenantUpdate: func(ctx context.Context, tenant *miniov2.Tenant, options metav1.UpdateOptions) (*miniov2.Tenant, error) {
					return &miniov2.Tenant{}, nil
				},
				mockTenantGet: func(ctx context.Context, namespace string, tenantName string, options metav1.GetOptions) (*miniov2.Tenant, error) {
					features := miniov2.Features{
						BucketDNS: true,
					}

					return &miniov2.Tenant{
						Spec: miniov2.TenantSpec{Features: &features},
					}, nil
				},
				domains: &models.DomainsConfiguration{
					Console: "http://console.min.io",
					Minio:   []string{"http://domain1.min.io", "http://domain2.min.io", "http://domain3.min.io"},
				},
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		opClientTenantGetMock = tt.args.mockTenantGet
		opClientTenantUpdateMock = tt.args.mockTenantUpdate
		t.Run(tt.name, func(t *testing.T) {
			if err := updateTenantDomains(tt.args.ctx, tt.args.operatorClient, tt.args.nameSpace, tt.args.tenantName, tt.args.domains); (err != nil) != tt.wantErr {
				t.Errorf("updateTenantDomains() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
