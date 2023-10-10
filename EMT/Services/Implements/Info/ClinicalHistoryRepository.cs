using EMT.Models.DAO;
using EMT.Services.Interface.Formats;
using EMT.Services.Interface.Info;
using MongoDB.Driver;

namespace EMT.Services.Implements.Info
{
    public class ClinicalHistoryRepository : IClinicalHistoryRepository
    {
        private readonly IMongoCollection<ClinicalHistory> _collection;
        private readonly IRoleRepository _roleRepository;
        private readonly IClinicalHistoryFormatRepository _clinicalHistoryFormatRepository;

        public ClinicalHistoryRepository(IMongoDatabase database, IRoleRepository roleRepository, IClinicalHistoryFormatRepository clinicalHistoryFormatRepository)
        {
            _collection = database.GetCollection<ClinicalHistory>("ClinicalHistory");
            _roleRepository = roleRepository;
            _clinicalHistoryFormatRepository = clinicalHistoryFormatRepository;
        }

        public ClinicalHistory GetById(string id)
        {
            return _collection.Find(ch => ch.Id == id).FirstOrDefault();
        }

        public IEnumerable<ClinicalHistory> GetAll()
        {
            return _collection.Find(_ => true).ToList();
        }

        public void Create(ClinicalHistory clinicalHistory)
        {
            _collection.InsertOne(clinicalHistory);
        }

        public void Update(string id, ClinicalHistory clinicalHistory)
        {
            _collection.ReplaceOne(ch => ch.Id == id, clinicalHistory);
        }

        public void Delete(string id)
        {
            _collection.DeleteOne(ch => ch.Id == id);
        }

        public void AddAttachet(string json)
        {
            throw new NotImplementedException();
        }

        public void Update(ClinicalHistory entity)
        {
            throw new NotImplementedException();
        }
    }

}
