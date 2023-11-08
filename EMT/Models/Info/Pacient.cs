using EMT.Models.Formats;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace EMT.Models.Implements
{
    public class Pacient
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public DateTime Created { get; set; }

        public List<Field> FieldsList { get; set; }
        public string PersonalInformationId { get; set; }
        public bool IsEnabled { get; set; }

       

        // Método para convertir el objeto a formato JSON
        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }

        // Método para convertir desde JSON a un objeto Paciente
        public static Pacient FromJson(JsonObject json)
        {
            try
            {
                // Aquí deberías extraer cada propiedad del objeto `json` y asignarla al objeto `Pacient`
                string id = json.ContainsKey("Id") ? json["Id"].GetValue<string>() : ObjectId.GenerateNewId().ToString();
                DateTime created = json.ContainsKey("Created") ? json["Created"].GetValue<DateTime>() : DateTime.MinValue;

                List<Field> fieldsList = new List<Field>();
                var fieldsListJsonArray = json.ContainsKey("FieldsList") ? json["FieldsList"].AsArray() : new JsonArray();

                foreach (var fieldJson in fieldsListJsonArray)
                {
                    // Procesa cada campo y crea un objeto Field
                    Field field = Field.FromJson((JsonObject)fieldJson);

                    fieldsList.Add(field);
                }

                string personalInformation = json.ContainsKey("PersonalInformationId") ? json["PersonalInformationId"].GetValue<string>() : null;

                // Crea un nuevo objeto Pacient con los valores obtenidos
                Pacient pacient = new Pacient
                {
                    Id = id,
                    Created = created,
                    FieldsList = fieldsList,
                    PersonalInformationId = personalInformation,
                    IsEnabled = json.ContainsKey("IsEnabled") ? json["IsEnabled"].GetValue<bool>() : false
                };

                return pacient;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a Pacient: {ex.Message}");
                return null;
            }
        }
    }
}

