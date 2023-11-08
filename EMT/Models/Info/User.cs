using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace EMT.Models.Implements
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public DateTime Created { get; set; }
        public string UserName { get; set; }
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

        // Método para convertir desde JSON a un objeto Usuario
        public static User FromJson(JsonObject json)
        {
            try
            {
                // Aquí deberías extraer cada propiedad del objeto `json` y asignarla al objeto `User`
                string id = json.ContainsKey("Id") ? json["Id"].GetValue<string>() : ObjectId.GenerateNewId().ToString();
                DateTime created = json.ContainsKey("Created") ? json["Created"].GetValue<DateTime>() : DateTime.MinValue;
                string userName = json.ContainsKey("UserName") ? json["UserName"].GetValue<string>() : string.Empty;

                // Cambio aquí: PersonalInformation ahora es de tipo PersonalInformation
                string personalInformation = json.ContainsKey("PersonalInformation")
                    ? json["PersonalInformationId"].GetValue<string>()
                    : null;

                bool isEnabled = json.ContainsKey("IsEnabled") && json["IsEnabled"].GetValue<bool>();

                // Crea un nuevo objeto User con los valores obtenidos
                User user = new User
                {
                    Id = id,
                    Created = created,
                    UserName = userName,
                    PersonalInformationId = personalInformation,
                    IsEnabled = isEnabled
                };

                return user;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a User: {ex.Message}");
                return null;
            }
        }
    }
}
