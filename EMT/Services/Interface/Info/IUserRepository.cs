using EMT.Models.Implements;
using MongoDB.Bson;

namespace EMT.Services.Interface.Info
{
    public interface IUserRepository : IRepository<User>
    {
        // Agrega operaciones específicas si es necesario

        // Obtiene el rol de un usuario por su id
        Role GetRoleByUserId(ObjectId userId);
    }
}
