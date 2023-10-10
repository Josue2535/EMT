using EMT.Models.Formats;
using EMT.Models.Implements;

namespace EMT.Services.Interface.Info
{
    public interface IPersonalInformationFormatRepository : IRepository<PersonalInformationFormat>
    {
        // Agrega operaciones específicas si es necesario

        // Valida si la información personal cumple con el formato
        bool IsPersonalInformationValid(PersonalInformationFormat personalInformationFormat, PersonalInformation personalInformation);
    }
}
