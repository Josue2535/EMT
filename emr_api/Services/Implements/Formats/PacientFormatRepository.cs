using EMT.Models.Formats;
using EMT.Services.Interface.Formats;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EMT.Services.Implements.Formats
{
    public class PacientFormatRepository : IPacientFormatRepository
    {
        private readonly IMongoCollection<PacientFormat> _collection;

        public PacientFormatRepository(string connectionString, string databaseName, string collectionName)
        {
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);
            _collection = database.GetCollection<PacientFormat>(collectionName);
        }

        public void Create(PacientFormat format)
        {
            // Verifica si ya existe un formato con los mismos datos
            var existingFormat = _collection.Find(f => true).FirstOrDefault();

            if (existingFormat != null)
            {
                // Ya existe un formato con los mismos datos, maneja el error o realiza alguna acción necesaria
                Console.WriteLine("Ya existe un formato con los mismos datos. No se puede crear uno nuevo.");
                // Puedes lanzar una excepción, devolver un mensaje de error, etc.
            }
            else
            {
                // No hay un formato existente, procede con la creación
                _collection.InsertOne(format);
                Console.WriteLine("Formato creado exitosamente.");
            }
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

        public void Delete(string id)
        {
            var filter = Builders<PacientFormat>.Filter.Eq(f => f.Id, id);
            _collection.DeleteOne(filter);
        }

        public bool IsPacientInformationValid(string json)
        {
            throw new NotImplementedException();
        }

        public PacientFormat GetFirst()
        {
            return _collection.Find(p => true).FirstOrDefault();
        }





        // Puedes agregar más métodos según sea necesario para tu aplicación
    }
}
