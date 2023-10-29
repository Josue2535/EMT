using EMT.Models.Formats;
using EMT.Services.Interface.Formats;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EMT.Services.Implements.Formats
{
    public class PacientFormatRepository : IPacientFormatRepository
    {
        private readonly IMongoCollection<PacientFormat> _collection;

        public PacientFormatRepository(IMongoDatabase database)
        {
            _collection = database.GetCollection<PacientFormat>("PacientFormats");
        }

        public void Create(PacientFormat format)
        {
            _collection.InsertOne(format);
        }

        public IEnumerable<PacientFormat> GetAll()
        {
            return _collection.Find(_ => true).ToList();
        }

        public PacientFormat GetById(string id)
        {
            return _collection.Find(f => f.Id.Equals(id)).FirstOrDefault();
        }

        public void Update( PacientFormat format)
        {
            var filter = Builders<PacientFormat>.Filter.Eq(f => f.Id, format.Id);
            _collection.ReplaceOne(filter, format);
        }

        public void Delete(ObjectId id)
        {
            var filter = Builders<PacientFormat>.Filter.Eq(f => f.Id, id);
            _collection.DeleteOne(filter);
        }

        public bool IsPacientInformationValid(string json)
        {
            throw new NotImplementedException();
        }

        public void Delete(string id)
        {
            throw new NotImplementedException();
        }



        // Puedes agregar más métodos según sea necesario para tu aplicación
    }
}
