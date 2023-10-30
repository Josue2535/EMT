using EMT.Services.Interface;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EMT.Services.Implements
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly IMongoCollection<T> _collection;

        public Repository(string connectionString, string databaseName, string collectionName)
        {
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);
            _collection = database.GetCollection<T>(collectionName);
        }

        public T GetById(string id)
        {
            var objectId = new ObjectId(id);
            return _collection.Find(new BsonDocument("_id", objectId)).SingleOrDefault();
        }

        public IEnumerable<T> GetAll()
        {
            return _collection.Find(_ => true).ToList();
        }

        public void Create(T entity)
        {
            _collection.InsertOne(entity);
        }

        public void Update(T entity)
        {
            var filter = Builders<T>.Filter.Eq("_id", GetIdValue(entity));
            _collection.ReplaceOne(filter, entity);
        }

        public void Delete(string id)
        {
            var objectId = new ObjectId(id);
            _collection.DeleteOne(new BsonDocument("_id", objectId));
        }

        private object GetIdValue(T entity)
        {
            var propertyInfo = typeof(T).GetProperty("Id"); // Ajusta el nombre de la propiedad ID según tu modelo
            return propertyInfo.GetValue(entity, null);
        }

        public void Delete(ObjectId id)
        {
            throw new NotImplementedException();
        }
    }
}
