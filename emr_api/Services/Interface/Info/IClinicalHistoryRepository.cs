using EMT.Models.DAO;

namespace EMT.Services.Interface.Info
{
    public interface IClinicalHistoryRepository : IRepository<ClinicalHistory>
    {
        ClinicalHistory GetByPacientId(string id);

        // Agrega operaciones específicas si es necesario

    }
}
