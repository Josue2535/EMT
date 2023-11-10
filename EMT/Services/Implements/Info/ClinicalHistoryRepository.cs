using EMT.Models.DAO;
using EMT.Models.Implements;
using EMT.Services.Interface.Formats;
using EMT.Services.Interface.Info;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EMT.Services.Implements.Info
{
    public class ClinicalHistoryRepository : IClinicalHistoryRepository
    {
        private readonly IMongoCollection<ClinicalHistory> _collection;
        private readonly IRoleRepository _roleRepository;
        private readonly IClinicalHistoryFormatRepository _clinicalHistoryFormatRepository;

        public ClinicalHistoryRepository(string connectionString, string databaseName, string collectionName)
        {
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);
            _collection = database.GetCollection<ClinicalHistory>(collectionName);
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
            // Verificar si ya existe una historia clínica para el mismo UserId
            var existingClinicalHistory = _collection.Find(ch => ch.PatientId == clinicalHistory.PatientId).FirstOrDefault();

            if (existingClinicalHistory == null)
            {
                // No existe, se puede crear la nueva historia clínica
                _collection.InsertOne(clinicalHistory);
            }
            else
            {
                // Ya existe una historia clínica para el mismo UserId, puedes manejarlo según tus necesidades
                // En este ejemplo, lanzamos una excepción, pero puedes ajustarlo según tu lógica
                throw new InvalidOperationException("Ya existe una historia clínica para este usuario.");
            }
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

        public ClinicalHistory GetByUserId(string userId)
        {
            return _collection.Find(ch => ch.PatientId == userId).FirstOrDefault();
        }
    }

}
