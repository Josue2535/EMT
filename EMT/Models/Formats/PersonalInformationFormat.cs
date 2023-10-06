using System.Text.Json;

namespace EMT.Models.Formats
{
    public class PersonalInformationFormat : Format
    {
        

        // Constructor por defecto
        public PersonalInformationFormat()
        {
            // No hay atributos específicos para inicializar por ahora
        }

        // Método para convertir el objeto a formato JSON
        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }
    }
}
