using EMT.Models.Formats;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace EMT.Models.Implements
{
    public class PersonalInformation
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public DateTime Created { get; set; }
        public List<Field> FieldList { get; set; }

        

        // Método para convertir el objeto a formato JSON
        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }

        // Método para convertir desde JSON a un objeto PersonalInformation
        public static PersonalInformation FromJson(JsonObject json)
        {
            try
            {
                // Aquí deberías extraer cada propiedad del objeto `json` y asignarla al objeto `PersonalInformation`
                string id = json.ContainsKey("Id") ? json["Id"].GetValue<string>() : ObjectId.GenerateNewId().ToString();
                DateTime created = json.ContainsKey("Created") ? json["Created"].GetValue<DateTime>() : DateTime.MinValue;

                List<Field> fieldList = new List<Field>();
                var fieldListJsonArray = json.ContainsKey("FieldList") ? json["FieldList"].AsArray() : new JsonArray();

                foreach (var fieldJson in fieldListJsonArray)
                {
                    // Procesa cada campo y crea un objeto Field
                    Field field = Field.FromJson((JsonObject)fieldJson);

                    fieldList.Add(field);
                }

                // Crea un nuevo objeto PersonalInformation con los valores obtenidos
                PersonalInformation personalInformation = new PersonalInformation
                {
                    Id = id,
                    Created = created,
                    FieldList = fieldList
                };

                return personalInformation;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a PersonalInformation: {ex.Message}");
                return null;
            }
        }
    }
}
