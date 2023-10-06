using EMT.Models.Formats;
using System.Text.Json;

namespace EMT.Models.Implements
{
    public class Pacient
    {
        public Guid Id { get; set; }
        public DateTime Created { get; set; }
        public List<Field> FieldsList { get; set; }
        public PersonalInformation PersonalInformation { get; set; }
        public bool IsEnabled { get; set; }

        // Constructor por defecto
        public Pacient()
        {
            Id = Guid.NewGuid();
            Created = DateTime.Now;
            FieldsList = new List<Field>();
            PersonalInformation = new PersonalInformation();
            IsEnabled = true; // Valor predeterminado
        }

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
