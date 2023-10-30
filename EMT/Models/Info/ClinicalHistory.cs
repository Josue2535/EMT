using EMT.Models.Formats;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;

namespace EMT.Models.DAO
{
    public class ClinicalHistory
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId? Id { get; set; }
        public DateTime Created { get; set; }
        public string PatientId { get; set; }
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
        public static ClinicalHistory FromJson(string json)
        {
            return JsonSerializer.Deserialize<ClinicalHistory>(json);
        }
    }
}
