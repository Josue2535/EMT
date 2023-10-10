using EMT.Models.Formats;

namespace EMT.Services.Interface.Formats
{
    public interface IClinicalHistoryFormatRepository : IRepository<ClinicalHistoryFormat>
    {
        // Valida si el formato de historia clínica es válido según el rol
        bool IsClinicalHistoryFormatValid(string json);
    }
}
