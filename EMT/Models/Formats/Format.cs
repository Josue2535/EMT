using System.Text.Json;

namespace EMT.Models.Formats
{
    public class Format
    {
        public Guid Id { get; set; }
        public DateTime CreationDate { get; set; }
        public List<FieldsFormat> ValidFields { get; set; }

        public Format()
        {
            Id = Guid.NewGuid();
            ValidFields = new List<FieldsFormat>();
            CreationDate = DateTime.Now;
        }

        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }
    }
}
