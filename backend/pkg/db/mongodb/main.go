package mongodb

import (
	"context"
	"sync"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoOptions struct {
	URL    string
	DbName string
}

var (
	client *mongo.Client
	once   sync.Once
)

func GetClient(moptions *MongoOptions) (*mongo.Client, error) {
	var err error = nil
	once.Do(func() {
		client, err = mongo.Connect(context.TODO(),
			options.Client().ApplyURI(moptions.URL),
		)
	})
	if err != nil {
		return nil, err
	}
	return client, err
}

func CheckInsertError(e error) error {
	if mgErr, ok := e.(mongo.BulkWriteException); ok {
		if mgErr.WriteConcernError != nil {
			return mgErr
		}
	}
	return nil
}
