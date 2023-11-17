using EMT.Models.Formats;
using EMT.Models.Implements;
using EMT.Services.Interface.Info;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EMT.Services.Implements.Formats
{
    public class RoleRepository : IRoleRepository
    {
        private readonly IMongoCollection<Role> _collection;

        public RoleRepository(string connectionString, string databaseName, string collectionName)
        {
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);
            _collection = database.GetCollection<Role>(collectionName);
        }

        public Role GetById(string id)
        {
            var filter = Builders<Role>.Filter.Regex("Name", new BsonRegularExpression(id, "i"));
            return _collection.Find(filter).FirstOrDefault();
        }

        public IEnumerable<Role> GetAll()
        {
            return _collection.Find(_ => true).ToList();
        }

        public void Create(Role role)
        {
            _collection.InsertOne(role);
        }

        public void Update(Role role)
        {
            _collection.ReplaceOne(r => r.Id == role.Id, role);
        }

        public void Delete(string id)
        {
            _collection.DeleteOne(role => role.Id.Equals( id));
        }

        public List<Field> GetValidFieldsForRole(string roleId)
        {
            var role = GetById(roleId);

            if (role != null)
            {
                return role.ValidFields;
            }

            // El rol no existe
            return new List<Field>();
        }

        
    }

}
