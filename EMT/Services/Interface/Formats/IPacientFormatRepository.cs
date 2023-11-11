using EMT.Models.Formats;
using EMT.Models.Implements;

namespace EMT.Services.Interface.Formats
{
    public interface IPacientFormatRepository : IRepository<PacientFormat>
    {
        PacientFormat GetFirst();

        // Agrega operaciones específicas si es necesario

        // Valida si la información del paciente cumple con el formato
        bool IsPacientInformationValid(string json);
    }
}
