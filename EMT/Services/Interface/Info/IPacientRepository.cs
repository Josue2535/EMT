using EMT.Models.Implements;

namespace EMT.Services.Interface.Info
{
    public interface IPacientRepository : IRepository<Pacient>
    {
        // Agrega operaciones específicas si es necesario

        // Agrega la información del paciente con validaciones
        void AddPacientInformation(Pacient pacient);
    }
}
