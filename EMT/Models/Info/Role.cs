using EMT.Models.Formats;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace EMT.Models.Implements
{
    public class Role
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public DateTime Created { get; set; }
        public string Name { get; set; }
        public List<Field> ValidFields { get; set; }


        // Método para convertir el objeto a formato JSON
        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }

        // Método para convertir desde JSON a un objeto Role
        public static Role FromJson(JsonObject json)
        {
            try
            {
                var id = json.ContainsKey("Id") ? new ObjectId(json["Id"].GetValue<string>()) : ObjectId.GenerateNewId();
                var created = json["Created"].GetValue<DateTime>();
                var name = json["Name"].GetValue<string>();

                var validFields = new List<Field>();
                var validFieldsJsonArray = json["ValidFields"].AsArray();
                foreach (var fieldJson in validFieldsJsonArray)
                {
                    // Procesa cada campo y crea un objeto Field
                    var fieldName = fieldJson["Name"].GetValue<string>();
                    var fieldValue = fieldJson["Value"].GetValue<string>();

                    var field = new Field
                    {
                        Name = fieldName,
                        Value = fieldValue
                    };

                    validFields.Add(field);
                }

                return new Role
                {
                    Id = id.ToString(),
                    Created = created,
                    Name = name,
                    ValidFields = validFields
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a Role: {ex.Message}");
                return null;
            }
        }

    }
}
