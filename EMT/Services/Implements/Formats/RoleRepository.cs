using EMT.Models.Formats;
using EMT.Models.Implements;
using EMT.Services.Interface.Info;
using MongoDB.Driver;

namespace EMT.Services.Implements.Formats
{
    public class RoleRepository : IRoleRepository
    {
        private readonly IMongoCollection<Role> _collection;

        public RoleRepository(IMongoDatabase database)
        {
            _collection = database.GetCollection<Role>("Roles");
        }

        public Role GetById(string id)
        {
            return _collection.Find(role => role.Id == id).FirstOrDefault();
        }

        public IEnumerable<Role> GetAll()
        {
            return _collection.Find(_ => true).ToList();
        }

        public void Create(Role role)
        {
            _collection.InsertOne(role);
        }

        public void Update(Role role)
        {
            _collection.ReplaceOne(r => r.Id == role.Id, role);
        }

        public void Delete(string id)
        {
            _collection.DeleteOne(role => role.Id == id);
        }

        public List<Field> GetValidFieldsForRole(string roleId)
        {
            var role = GetById(roleId);

            if (role != null)
            {
                return role.ValidFields;
            }

            // El rol no existe
            return new List<Field>();
        }
    }

}
