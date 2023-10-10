using EMT.Models.Formats;
using EMT.Models.Implements;

namespace EMT.Services.Interface.Info
{
    public interface IRoleRepository : IRepository<Role>
    {
        // Agrega operaciones específicas si es necesario

        // Obtiene los campos válidos para un rol
        List<FieldsFormat> GetValidFieldsForRole(string roleId);
    }
}
