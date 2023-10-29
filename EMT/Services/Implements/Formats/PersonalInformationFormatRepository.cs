using EMT.Models.Formats;
using EMT.Models.Implements;
using EMT.Services.Interface;
using EMT.Services.Interface.Formats;
using EMT.Services.Interface.Info;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json;

namespace EMT.Services.Implements.Formats
{
    public class PersonalInformationFormatRepository : IPersonalInformationFormatRepository
    {
        private readonly IMongoCollection<PersonalInformationFormat> _collection;

        public PersonalInformationFormatRepository(string connectionString, string databaseName, string collectionName)
        {
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);
            _collection = database.GetCollection<PersonalInformationFormat>(collectionName);
        }


        public PersonalInformationFormat GetById(ObjectId id)
        {
            return _collection.Find(pi => pi.Id == id).FirstOrDefault();
        }

        public IEnumerable<PersonalInformationFormat> GetAll()
        {
            return _collection.Find(_ => true).ToList();
        }

        public void Create(PersonalInformationFormat personalInformation)
        {
            _collection.InsertOne(personalInformation);
        }

        public void Update( PersonalInformationFormat personalInformation)
        {
            _collection.ReplaceOne(pi => pi.Id == personalInformation.Id, personalInformation);
        }

        public void Delete(ObjectId id)
        {
            _collection.DeleteOne(pi => pi.Id == id);
        }

        public bool IsPersonalInformationValid(string json)
        {
            throw new NotImplementedException();
        }

        public PersonalInformationFormat GetById(string id)
        {
            throw new NotImplementedException();
        }
    }

}
