using EMT.Models.Implements;

namespace EMT.Services.Interface.Info
{
    public interface IPacientRepository : IRepository<Pacient>
    {
        // Agrega operaciones específicas si es necesario
        IEnumerable<Pacient> SearchByField(string fieldName, string value);
        IEnumerable<Pacient> GetByRole(string name);
    }
}
