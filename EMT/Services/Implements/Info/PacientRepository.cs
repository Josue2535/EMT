using EMT.Models.Implements;
using EMT.Services.Interface.Formats;
using EMT.Services.Interface.Info;
using MongoDB.Driver;

namespace EMT.Services.Implements.Info
{
    public class PacientRepository : IPacientRepository
    {
        private readonly IMongoCollection<Pacient> _collection;
        private readonly IRoleRepository _roleRepository;
        private readonly IPacientFormatRepository _pacientFormatRepository;

        public PacientRepository(IMongoDatabase database, IRoleRepository roleRepository, IPacientFormatRepository pacientFormatRepository)
        {
            _collection = database.GetCollection<Pacient>("Pacients");
            _roleRepository = roleRepository;
            _pacientFormatRepository = pacientFormatRepository;
        }

        public Pacient GetById(string id)
        {
            return _collection.Find(p => p.Id == id).FirstOrDefault();
        }

        public IEnumerable<Pacient> GetAll()
        {
            return _collection.Find(_ => true).ToList();
        }

        public void Create(Pacient pacient)
        {
            _collection.InsertOne(pacient);
        }

        public void Update( Pacient pacient)
        {
            _collection.ReplaceOne(p => p.Id == pacient.Id, pacient);
        }

        public void Delete(string id)
        {
            _collection.DeleteOne(p => p.Id == id);
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

    }
}
