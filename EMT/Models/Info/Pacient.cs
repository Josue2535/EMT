using EMT.Models.Formats;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;

namespace EMT.Models.Implements
{
    public class Pacient
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId? Id { get; set; }
        public DateTime Created { get; set; }
        public List<Field> FieldsList { get; set; }
        public PersonalInformation PersonalInformation { get; set; }
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
        public static Pacient FromJson(string json)
        {
            return JsonSerializer.Deserialize<Pacient>(json);
        }
    }
}
