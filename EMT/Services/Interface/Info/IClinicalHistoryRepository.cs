using EMT.Models.DAO;

namespace EMT.Services.Interface.Info
{
    public interface IClinicalHistoryRepository : IRepository<ClinicalHistory>
    {
        // Agrega operaciones específicas si es necesario

        void AddAttachet(string json);
    }
}
