package mongo

func MongoRepositoryResolver[TEntity any](collectionName string) *MongoRepositoryBase[TEntity] {
	return NewMongoRepositoryBase[TEntity](collectionName)
}
