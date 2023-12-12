using EMT.Models.Formats;
using EMT.Models.Implements;

namespace EMT.Services.Interface.Formats
{
    public interface IPersonalInformationFormatRepository : IRepository<PersonalInformationFormat>
    {
        PersonalInformationFormat GetFirst();
        // Agrega operaciones específicas si es necesario

        // Valida si la información personal cumple con el formato
        bool IsPersonalInformationValid(string json);
    }
}
