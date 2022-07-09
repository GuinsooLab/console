/*
Copyright 2020 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Code generated by lister-gen. DO NOT EDIT.

package v1beta2

import (
	v1beta2 "github.com/minio/console/pkg/apis/networking.gke.io/v1beta2"
	"k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/client-go/tools/cache"
)

// ManagedCertificateLister helps list ManagedCertificates.
type ManagedCertificateLister interface {
	// List lists all ManagedCertificates in the indexer.
	List(selector labels.Selector) (ret []*v1beta2.ManagedCertificate, err error)
	// ManagedCertificates returns an object that can list and get ManagedCertificates.
	ManagedCertificates(namespace string) ManagedCertificateNamespaceLister
	ManagedCertificateListerExpansion
}

// managedCertificateLister implements the ManagedCertificateLister interface.
type managedCertificateLister struct {
	indexer cache.Indexer
}

// NewManagedCertificateLister returns a new ManagedCertificateLister.
func NewManagedCertificateLister(indexer cache.Indexer) ManagedCertificateLister {
	return &managedCertificateLister{indexer: indexer}
}

// List lists all ManagedCertificates in the indexer.
func (s *managedCertificateLister) List(selector labels.Selector) (ret []*v1beta2.ManagedCertificate, err error) {
	err = cache.ListAll(s.indexer, selector, func(m interface{}) {
		ret = append(ret, m.(*v1beta2.ManagedCertificate))
	})
	return ret, err
}

// ManagedCertificates returns an object that can list and get ManagedCertificates.
func (s *managedCertificateLister) ManagedCertificates(namespace string) ManagedCertificateNamespaceLister {
	return managedCertificateNamespaceLister{indexer: s.indexer, namespace: namespace}
}

// ManagedCertificateNamespaceLister helps list and get ManagedCertificates.
type ManagedCertificateNamespaceLister interface {
	// List lists all ManagedCertificates in the indexer for a given namespace.
	List(selector labels.Selector) (ret []*v1beta2.ManagedCertificate, err error)
	// Get retrieves the ManagedCertificate from the indexer for a given namespace and name.
	Get(name string) (*v1beta2.ManagedCertificate, error)
	ManagedCertificateNamespaceListerExpansion
}

// managedCertificateNamespaceLister implements the ManagedCertificateNamespaceLister
// interface.
type managedCertificateNamespaceLister struct {
	indexer   cache.Indexer
	namespace string
}

// List lists all ManagedCertificates in the indexer for a given namespace.
func (s managedCertificateNamespaceLister) List(selector labels.Selector) (ret []*v1beta2.ManagedCertificate, err error) {
	err = cache.ListAllByNamespace(s.indexer, s.namespace, selector, func(m interface{}) {
		ret = append(ret, m.(*v1beta2.ManagedCertificate))
	})
	return ret, err
}

// Get retrieves the ManagedCertificate from the indexer for a given namespace and name.
func (s managedCertificateNamespaceLister) Get(name string) (*v1beta2.ManagedCertificate, error) {
	obj, exists, err := s.indexer.GetByKey(s.namespace + "/" + name)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, errors.NewNotFound(v1beta2.Resource("managedcertificate"), name)
	}
	return obj.(*v1beta2.ManagedCertificate), nil
}
