using EMT.Models.DAO;

namespace EMT.Services.Interface.Info
{
    public interface IClinicalHistoryRepository : IRepository<ClinicalHistory>
    {
        // Agrega operaciones específicas si es necesario

        // Agrega la historia clínica con validaciones
        void AddClinicalHistory(ClinicalHistory clinicalHistory, string roleId);
    }
}
