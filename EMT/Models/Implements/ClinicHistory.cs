using EMT.Models.Formats;
using System.Text.Json;

namespace EMT.Models.DAO
{
    public class ClinicHistory
    {
        public Guid Id { get; set; }
        public DateTime Created { get; set; }
        public Guid PatientId { get; set; }
        public List<Attached> Attachments { get; set; }

        // Constructor por defecto
        public ClinicHistory()
        {
            Id = Guid.NewGuid();
            Created = DateTime.Now;
            Attachments = new List<Attached>();
        }

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
