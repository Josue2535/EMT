using EMT.Models.Implements;

namespace EMT.Services.Interface.Info
{
    public interface IPersonalInformationRepository : IRepository<PersonalInformation>
    {
        // Agrega operaciones específicas si es necesario

        // Agrega la información personal con validaciones
        void AddPersonalInformation(PersonalInformation personalInformation);
    }
}
