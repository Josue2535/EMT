using EMT.Models.Formats;
using System.Text.Json;

namespace EMT.Models.Implements
{
    public class PersonalInformation
    {
        public DateTime Created { get; set; }
        public List<Field> FieldList { get; set; }

        // Constructor por defecto
        public PersonalInformation()
        {
            Created = DateTime.Now;
            FieldList = new List<Field>();
        }

        // Método para convertir el objeto a formato JSON
        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }

        // Método para convertir desde JSON a un objeto PersonalInformation
        public static PersonalInformation FromJson(string json)
        {
            return JsonSerializer.Deserialize<PersonalInformation>(json);
        }
    }
}
