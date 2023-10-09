using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;

namespace EMT.Models.Implements
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public DateTime Created { get; set; }
        public string UserName { get; set; }
        public PersonalInformation PersonalInformation { get; set; }
        public Role Role { get; set; }
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
        public static User FromJson(string json)
        {
            return JsonSerializer.Deserialize<User>(json);
        }
    }
}
