using EMT.Models.Implements;
using EMT.Services.Interface.Formats;
using EMT.Services.Interface.Info;
using MongoDB.Driver;

namespace EMT.Services.Implements.Info
{
    public class PersonalInformationRepository : IPersonalInformationRepository
    {
        private readonly IMongoCollection<PersonalInformation> _collection;
        private readonly IRoleRepository _roleRepository;
        private readonly IPersonalInformationFormatRepository _personalInformationFormatRepository;

        public PersonalInformationRepository(IMongoDatabase database, IRoleRepository roleRepository, IPersonalInformationFormatRepository personalInformationFormatRepository)
        {
            _collection = database.GetCollection<PersonalInformation>("PersonalInformation");
            _roleRepository = roleRepository;
            _personalInformationFormatRepository = personalInformationFormatRepository;
        }

        public PersonalInformation GetById(string id)
        {
            return _collection.Find(p => p.Id == id).FirstOrDefault();
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
            _collection.DeleteOne(p => p.Id == id);
        }

       
    }

}
