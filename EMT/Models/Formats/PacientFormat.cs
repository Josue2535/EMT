using System.Text.Json;

namespace EMT.Models.Formats
{
    public class PacientFormat : Format
    {
        // Puedes dejar esta clase vacía por ahora si no tienes atributos específicos para PacientFormat

        // Constructor por defecto
        public PacientFormat()
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
