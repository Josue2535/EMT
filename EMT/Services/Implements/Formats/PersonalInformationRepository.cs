using EMT.Models.Implements;
using EMT.Services.Interface.Info;
using MongoDB.Driver;
using System.Text.Json;

namespace EMT.Services.Implements.Formats
{
    public class PersonalInformationRepository : IPersonalInformationRepository
    {
        private readonly IMongoCollection<PersonalInformation> _collection;

        public PersonalInformationRepository(IMongoDatabase database)
        {
            _collection = database.GetCollection<PersonalInformation>("PersonalInformation");
        }

        public PersonalInformation GetById(string id)
        {
            return _collection.Find(pi => pi.Id == id).FirstOrDefault();
        }

        public IEnumerable<PersonalInformation> GetAll()
        {
            return _collection.Find(_ => true).ToList();
        }

        public void Create(PersonalInformation personalInformation)
        {
            _collection.InsertOne(personalInformation);
        }

        public void Update(string id, PersonalInformation personalInformation)
        {
            _collection.ReplaceOne(pi => pi.Id == id, personalInformation);
        }

        public void Delete(string id)
        {
            _collection.DeleteOne(pi => pi.Id == id);
        }

        public void AddPersonalInformation(PersonalInformation personalInformation)
        {
            throw new NotImplementedException();
        }

        public void Update(PersonalInformation entity)
        {
            throw new NotImplementedException();
        }
    }

}
