using EMT.Models.Formats;
using EMT.Models.Implements;
using EMT.Services.Interface.Formats;
using EMT.Services.Interface.Info;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EMT.Services.Implements.Info
{
    public class PersonalInformationRepository : IPersonalInformationRepository
    {
        private readonly IMongoCollection<PersonalInformation> _collection;
        private readonly IRoleRepository _roleRepository;
        private readonly IPersonalInformationFormatRepository _personalInformationFormatRepository;

        public PersonalInformationRepository(string connectionString, string databaseName, string collectionName)
        {
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);
            _collection = database.GetCollection<PersonalInformation>(collectionName);
        }

        public PersonalInformation GetById(string id)
        {
            return _collection.Find(p => p.Id.Equals( id)).FirstOrDefault();
        }

        public IEnumerable<PersonalInformation> GetAll()
        {
            return _collection.Find(_ => true).ToList();
        }

        public void Create(PersonalInformation personalInformation)
        {
            _collection.InsertOne(personalInformation);
        }

        public void Update( PersonalInformation personalInformation)
        {
            _collection.ReplaceOne(p => p.Id == personalInformation.Id, personalInformation);
        }

        public void Delete(string id)
        {
            _collection.DeleteOne(p => p.Id.Equals(id));
        }
        public IEnumerable<PersonalInformation> SearchByField(string fieldName, string value)
        {
            // Implementación de la búsqueda por campo específico
            var filter = new Field();
            filter.Name = fieldName;
            filter.Value = value;
            return _collection.Find(p => p.FieldList.Contains(filter)).ToList();
        }
    }

}
