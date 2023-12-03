using EMT.Models.DAO;
using EMT.Models.Formats;
using EMT.Models.Implements;
using EMT.Services.Interface.Formats;
using EMT.Services.Interface.Info;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Xml.Linq;

namespace EMT.Services.Implements.Info
{
    public class PacientRepository : IPacientRepository
    {
        private readonly IMongoCollection<Pacient> _collection;
        private readonly IRoleRepository _roleRepository;
        private readonly IPacientFormatRepository _pacientFormatRepository;

        public PacientRepository(string connectionString, string databaseName, string collectionName)
        {
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);
            _collection = database.GetCollection<Pacient>(collectionName);
        }

        public Pacient GetById(string id)
        {
            return _collection.Find(p => p.Id.Equals(id)).FirstOrDefault();
        }

        public IEnumerable<Pacient> GetAll()
        {
            return _collection.Find(_ => true).ToList();
        }

        public void Create(Pacient pacient)
        {
            // Verificar si ya existe un paciente con el mismo ID de información personal
            if (IsDuplicatePersonalInfoId(pacient.PersonalInformationId))
            {
                Console.WriteLine($"Ya existe un paciente con el ID de información personal: {pacient.PersonalInformationId}");
                // Puedes lanzar una excepción, manejar el error de alguna otra manera, o simplemente salir del método
                return;
            }

            // Si no hay duplicados, proceder con la inserción
            _collection.InsertOne(pacient);
        }

        private bool IsDuplicatePersonalInfoId(string personalInfoId)
        {
            // Verificar si hay algún paciente con el mismo ID de información personal en la base de datos
            return _collection.Find(p => p.PersonalInformationId == personalInfoId).Any();
        }

        public void Update( Pacient pacient)
        {
            _collection.ReplaceOne(p => p.Id == pacient.Id, pacient);
        }

        public void Delete(string id)
        {
            _collection.DeleteOne(p => p.Id.Equals( id));
        }

        public void AddPacient(Pacient pacient, string roleId)
        {
            var role = _roleRepository.GetById(roleId);

            if (role == null || role.ValidFields == null || role.ValidFields.Count == 0)
            {
                // El rol no existe o no tiene campos válidos asignados
                throw new InvalidOperationException("Invalid role or role without valid fields.");
            }

            
            // Puedes agregar lógica adicional según tus necesidades
            // ...

            // Agregar el paciente
            Create(pacient);
        }

        public IEnumerable<Pacient> GetByRole(string name)
        {
            return _collection.Find(p => p.Role.Equals(name)).ToList();
        }
        public IEnumerable<Pacient> SearchByField(string fieldName, string value)
        {
            // Implementación de la búsqueda por campo específico
            var filter = new Field();
            filter.Name = fieldName;
            filter.Value = value;   
            return _collection.Find(p => p.FieldsList.Contains(filter)).ToList();
        }
    }
}
