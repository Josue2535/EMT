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
            var objectId = ObjectId.Parse(id);
            var filter = Builders<User>.Filter.Eq("_id", objectId);
            return _collection.Find(filter).FirstOrDefault();
        }
        private bool IsDuplicatePersonalInfoId(string personalInfoId)
        {
            // Verificar si hay algún paciente con el mismo ID de información personal en la base de datos
            return _collection.Find(p => p.PersonalInformationId == personalInfoId).Any();
        }
        public IEnumerable<User> GetAll()
        {
            return _collection.Find(p => true).ToList();
        }

        public void Create(User user)
        {
            if(IsDuplicatePersonalInfoId(user.PersonalInformationId))
            {
                Console.WriteLine($"Ya existe un Usuario con el ID de información personal: {user.PersonalInformationId}");
                // Puedes lanzar una excepción, manejar el error de alguna otra manera, o simplemente salir del método
                return;
            }
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
