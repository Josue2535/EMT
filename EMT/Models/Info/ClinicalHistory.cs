using EMT.Models.Formats;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace EMT.Models.DAO
{
    public class ClinicalHistory
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public DateTime Created { get; set; }
        public string PatientId { get; set; }

        public string NameFormat {  get; set; }
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
        public static ClinicalHistory FromJson(JsonObject json)
        {
            try
            {
                // Asegúrate de manejar adecuadamente el campo "Id"
                var id = json.ContainsKey("Id") ? json["Id"].GetValue<string>() : ObjectId.GenerateNewId().ToString();

                DateTime created = json.ContainsKey("Created") ? json["Created"].GetValue<DateTime>(): DateTime.Now;
                string patientId = json["PatientId"].GetValue<string>();
                string nameFormat = json["NameFormat"].GetValue<string>();

                List<Attached> attachments = new List<Attached>();
                var attachmentsJsonArray = json["Attachments"].AsArray();
                foreach (var attachmentJson in attachmentsJsonArray)
                {
                    // Procesa cada adjunto y crea un objeto Attached
                    Attached attachment = Attached.FromJson((JsonObject)attachmentJson);
                    attachments.Add(attachment);
                }

                // Crea un nuevo objeto ClinicalHistory con los valores obtenidos
                ClinicalHistory clinicalHistory = new ClinicalHistory
                {
                    Id = id,
                    Created = created,
                    PatientId = patientId,
                    Attachments = attachments,
                    NameFormat = nameFormat
                };

                return clinicalHistory;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a ClinicalHistory: {ex.Message}");
                return null;
            }
        }
    }
}
