// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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
	"strings"

	"github.com/go-openapi/runtime/middleware"
	"github.com/go-openapi/swag"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	bucketApi "github.com/minio/console/restapi/operations/bucket"
	"github.com/minio/minio-go/v7/pkg/notification"
)

func registerBucketEventsHandlers(api *operations.ConsoleAPI) {
	// list bucket events
	api.BucketListBucketEventsHandler = bucketApi.ListBucketEventsHandlerFunc(func(params bucketApi.ListBucketEventsParams, session *models.Principal) middleware.Responder {
		listBucketEventsResponse, err := getListBucketEventsResponse(session, params)
		if err != nil {
			return bucketApi.NewListBucketEventsDefault(int(err.Code)).WithPayload(err)
		}
		return bucketApi.NewListBucketEventsOK().WithPayload(listBucketEventsResponse)
	})
	// create bucket event
	api.BucketCreateBucketEventHandler = bucketApi.CreateBucketEventHandlerFunc(func(params bucketApi.CreateBucketEventParams, session *models.Principal) middleware.Responder {
		if err := getCreateBucketEventsResponse(session, params); err != nil {
			return bucketApi.NewCreateBucketEventDefault(int(err.Code)).WithPayload(err)
		}
		return bucketApi.NewCreateBucketEventCreated()
	})
	// delete bucket event
	api.BucketDeleteBucketEventHandler = bucketApi.DeleteBucketEventHandlerFunc(func(params bucketApi.DeleteBucketEventParams, session *models.Principal) middleware.Responder {
		if err := getDeleteBucketEventsResponse(session, params); err != nil {
			return bucketApi.NewDeleteBucketEventDefault(int(err.Code)).WithPayload(err)
		}
		return bucketApi.NewDeleteBucketEventNoContent()
	})
}

// listBucketEvents fetches a list of all events set for a bucket and serializes them for a proper output
func listBucketEvents(client MinioClient, bucketName string) ([]*models.NotificationConfig, error) {
	var configs []*models.NotificationConfig
	bn, err := client.getBucketNotification(context.Background(), bucketName)
	if err != nil {
		return nil, err
	}

	// Generate pretty event names from event types
	prettyEventNames := func(eventsTypes []notification.EventType) []models.NotificationEventType {
		var result []models.NotificationEventType
		for _, eventType := range eventsTypes {
			var eventTypePretty models.NotificationEventType
			switch eventType {
			case notification.ObjectAccessedAll:
				eventTypePretty = models.NotificationEventTypeGet
			case notification.ObjectCreatedAll:
				eventTypePretty = models.NotificationEventTypePut
			case notification.ObjectRemovedAll:
				eventTypePretty = models.NotificationEventTypeDelete
			}
			result = append(result, eventTypePretty)
		}
		return result
	}
	// part of implementation taken from minio/mc
	// s3Client.ListNotificationConfigs()... to serialize configurations
	getFilters := func(config notification.Config) (prefix, suffix string) {
		if config.Filter == nil {
			return
		}
		for _, filter := range config.Filter.S3Key.FilterRules {
			if strings.ToLower(filter.Name) == "prefix" {
				prefix = filter.Value
			}
			if strings.ToLower(filter.Name) == "suffix" {
				suffix = filter.Value
			}

		}
		return prefix, suffix
	}
	for _, embed := range bn.TopicConfigs {
		prefix, suffix := getFilters(embed.Config)
		configs = append(configs, &models.NotificationConfig{
			ID:     embed.ID,
			Arn:    swag.String(embed.Topic),
			Events: prettyEventNames(embed.Events),
			Prefix: prefix,
			Suffix: suffix,
		})
	}
	for _, embed := range bn.QueueConfigs {
		prefix, suffix := getFilters(embed.Config)
		configs = append(configs, &models.NotificationConfig{
			ID:     embed.ID,
			Arn:    swag.String(embed.Queue),
			Events: prettyEventNames(embed.Events),
			Prefix: prefix,
			Suffix: suffix,
		})
	}
	for _, embed := range bn.LambdaConfigs {
		prefix, suffix := getFilters(embed.Config)
		configs = append(configs, &models.NotificationConfig{
			ID:     embed.ID,
			Arn:    swag.String(embed.Lambda),
			Events: prettyEventNames(embed.Events),
			Prefix: prefix,
			Suffix: suffix,
		})
	}
	return configs, nil
}

// getListBucketsResponse performs listBucketEvents() and serializes it to the handler's output
func getListBucketEventsResponse(session *models.Principal, params bucketApi.ListBucketEventsParams) (*models.ListBucketEventsResponse, *models.Error) {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	mClient, err := newMinioClient(session)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// create a minioClient interface implementation
	// defining the client to be used
	minioClient := minioClient{client: mClient}

	bucketEvents, err := listBucketEvents(minioClient, params.BucketName)
	if err != nil {
		return nil, ErrorWithContext(ctx, err)
	}
	// serialize output
	listBucketsResponse := &models.ListBucketEventsResponse{
		Events: bucketEvents,
		Total:  int64(len(bucketEvents)),
	}
	return listBucketsResponse, nil
}

// createBucketEvent calls mc AddNotificationConfig() to create a bucket nofication
//
// If notificationEvents is empty, by default will set [get, put, delete], else the provided
// ones will be set.
// this function follows same behavior as minio/mc for adding a bucket event
func createBucketEvent(ctx context.Context, client MCClient, arn string, notificationEvents []models.NotificationEventType, prefix, suffix string, ignoreExisting bool) error {
	var events []string
	if len(notificationEvents) == 0 {
		// default event values are [get, put, delete]
		events = []string{
			string(models.NotificationEventTypeGet),
			string(models.NotificationEventTypePut),
			string(models.NotificationEventTypeDelete),
		}
	} else {
		// else use defined events in request
		// cast type models.NotificationEventType to string
		for _, e := range notificationEvents {
			events = append(events, string(e))
		}
	}

	perr := client.addNotificationConfig(ctx, arn, events, prefix, suffix, ignoreExisting)
	if perr != nil {
		return perr.Cause
	}
	return nil
}

// getCreateBucketEventsResponse calls createBucketEvent to add a bucket event notification
func getCreateBucketEventsResponse(session *models.Principal, params bucketApi.CreateBucketEventParams) *models.Error {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	bucketName := params.BucketName
	eventReq := params.Body
	s3Client, err := newS3BucketClient(session, bucketName, "")
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	mcClient := mcClient{client: s3Client}
	err = createBucketEvent(ctx, mcClient, *eventReq.Configuration.Arn, eventReq.Configuration.Events, eventReq.Configuration.Prefix, eventReq.Configuration.Suffix, eventReq.IgnoreExisting)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}

// deleteBucketEventNotification calls S3Client.RemoveNotificationConfig to remove a bucket event notification
func deleteBucketEventNotification(ctx context.Context, client MCClient, arn string, events []models.NotificationEventType, prefix, suffix *string) error {
	eventSingleString := joinNotificationEvents(events)
	perr := client.removeNotificationConfig(ctx, arn, eventSingleString, *prefix, *suffix)
	if perr != nil {
		return perr.Cause
	}
	return nil
}

func joinNotificationEvents(events []models.NotificationEventType) string {
	var eventsArn []string
	for _, e := range events {
		eventsArn = append(eventsArn, string(e))
	}
	return strings.Join(eventsArn, ",")
}

// getDeleteBucketEventsResponse calls deleteBucketEventNotification() to delete a bucket event notification
func getDeleteBucketEventsResponse(session *models.Principal, params bucketApi.DeleteBucketEventParams) *models.Error {
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	bucketName := params.BucketName
	arn := params.Arn
	events := params.Body.Events
	prefix := params.Body.Prefix
	suffix := params.Body.Suffix
	s3Client, err := newS3BucketClient(session, bucketName, "")
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	// create a mc S3Client interface implementation
	// defining the client to be used
	mcClient := mcClient{client: s3Client}
	err = deleteBucketEventNotification(ctx, mcClient, arn, events, prefix, suffix)
	if err != nil {
		return ErrorWithContext(ctx, err)
	}
	return nil
}
