using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace EMT.Models.Formats
{
    public class Format
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public DateTime CreationDate { get; set; }

        
        public List<FieldsFormat> ValidFields { get; set; }

        public Format() { 
            Id = new ObjectId().ToString();
        }

        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }
        public static Format FromJson(JsonObject json)
        {
            try
            {
                // Aquí deberías extraer cada propiedad del objeto `json` y asignarla al objeto `Format`
                string id = json.ContainsKey("Id") ? json["Id"].GetValue<string>() : ObjectId.GenerateNewId().ToString();
                DateTime creationDate = json.ContainsKey("CreationDate") ? json["CreationDate"].GetValue<DateTime>() : DateTime.MinValue;

                List<FieldsFormat> validFields = new List<FieldsFormat>();
                var validFieldsJsonArray = json.ContainsKey("ValidFields") ? json["ValidFields"].AsArray() : new JsonArray();

                foreach (var fieldJson in validFieldsJsonArray)
                {
                    // Procesa cada campo y crea un objeto FieldsFormat
                    FieldsFormat field = FieldsFormat.FromJson((JsonObject)fieldJson);

                    validFields.Add(field);
                }

                // Crea un nuevo objeto Format con los valores obtenidos
                Format format = new Format
                {
                    Id = id,
                    CreationDate = creationDate,
                    ValidFields = validFields
                };

                return format;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a Format: {ex.Message}");
                return null;
            }
        }
    }
}
