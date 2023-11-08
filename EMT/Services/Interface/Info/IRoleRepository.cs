using EMT.Models.Formats;
using EMT.Models.Implements;
using MongoDB.Bson;

namespace EMT.Services.Interface.Info
{
    public interface IRoleRepository : IRepository<Role>
    {
        // Agrega operaciones específicas si es necesario

        // Obtiene los campos válidos para un rol
        List<Field> GetValidFieldsForRole(string roleId);
    }
}
