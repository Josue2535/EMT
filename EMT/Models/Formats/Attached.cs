using System.Text.Json;

namespace EMT.Models.Formats
{
    public class Attached
    {
        public string id { get; set; }
        public DateTime Created { get; set; }
        public List<Field> Fields { get; set; }

        // Constructor por defecto
        public Attached()
        {
            Created = DateTime.Now;
            Fields = new List<Field>();
        }

        // Método para convertir el objeto a formato JSON
        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }

        // Método para convertir desde JSON a un objeto Attached
        public static Attached FromJson(string json)
        {
            return JsonSerializer.Deserialize<Attached>(json);
        }
    }
}
