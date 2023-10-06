using EMT.Models.Formats;
using System.Text.Json;

namespace EMT.Models.Implements
{
    public class Role
    {
        public Guid Id { get; set; }
        public DateTime Created { get; set; }
        public string Name { get; set; }
        public List<Field> ValidFields { get; set; }

        // Constructor por defecto
        public Role()
        {
            Id = Guid.NewGuid();
            Created = DateTime.Now;
            ValidFields = new List<Field>();
        }

        // Método para convertir el objeto a formato JSON
        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }

        // Método para convertir desde JSON a un objeto Role
        public static Role FromJson(string json)
        {
            return JsonSerializer.Deserialize<Role>(json);
        }
    }
}
