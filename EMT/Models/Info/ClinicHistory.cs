using EMT.Models.Formats;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;

namespace EMT.Models.DAO
{
    public class ClinicHistory
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public DateTime Created { get; set; }
        public Guid PatientId { get; set; }
        public List<Attached> Attachments { get; set; }
      
        // Método para convertir el objeto a formato JSON
        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }

        // Método para convertir desde JSON a un objeto ClinicHistory
        public static ClinicHistory FromJson(string json)
        {
            return JsonSerializer.Deserialize<ClinicHistory>(json);
        }
    }
}
