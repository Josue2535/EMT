using MongoDB.Bson;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace EMT.Models.Formats
{
    public class Attached
    {
        public string id { get; set; }
        public DateTime Created { get; set; }
        public List<Field> Fields { get; set; }
        string NameFormat { get; set; }

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
        public static Attached FromJson(JsonObject json)
        {
            try
            {
                string id = json.ContainsKey("Id") ? json["Id"].GetValue<string>() : ObjectId.GenerateNewId().ToString();
                DateTime created = json.ContainsKey("Created") ? json["Created"].GetValue<DateTime>() : DateTime.Now;
                string name = json["NameFormat"].GetValue<string>();
                List<Field> fields = new List<Field>();
                var fieldsJsonArray = json["Fields"].AsArray();
                foreach (var fieldJson in fieldsJsonArray)
                {
                    // Procesa cada campo y crea un objeto Field
                    Field field = Field.FromJson((JsonObject)fieldJson);
                    fields.Add(field);
                }

                // Crea un nuevo objeto Attached con los valores obtenidos
                Attached attached = new Attached
                {
                    id = id,
                    NameFormat = name,
                    Created = created,
                    Fields = fields
                };

                return attached;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a Attached: {ex.Message}");
                return null;
            }
        }
    }
}
