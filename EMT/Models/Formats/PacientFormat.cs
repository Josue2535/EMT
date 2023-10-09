using System.Text.Json;

namespace EMT.Models.Formats
{
    public class PacientFormat : Format
    {
        

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
