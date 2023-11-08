using EMT.Models.Implements;
using EMT.Services.Interface.Info;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EMT.Services.Implements.Info
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _collection;

        public UserRepository(string connectionString, string databaseName, string collectionName)
        {
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);
            _collection = database.GetCollection<User>(collectionName);
        }

        public User GetById(string id)
        {
            return _collection.Find(user => user.Id.Equals( id)).FirstOrDefault();
        }

        public IEnumerable<User> GetAll()
        {
            return _collection.Find(_ => true).ToList();
        }

        public void Create(User user)
        {
            _collection.InsertOne(user);
        }

        public void Update( User user)
        {
            _collection.ReplaceOne(u => u.Id == user.Id, user);
        }

        public void Delete(string id)
        {
            _collection.DeleteOne(user => user.Id.Equals( id));
        }

        

       
    }

}
