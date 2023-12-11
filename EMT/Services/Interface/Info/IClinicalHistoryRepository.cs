using EMT.Models.DAO;

namespace EMT.Services.Interface.Info
{
    public interface IClinicalHistoryRepository : IRepository<ClinicalHistory>
    {
        // Agrega operaciones específicas si es necesario

        ClinicalHistory GetByUserId(string id);
    }
}
