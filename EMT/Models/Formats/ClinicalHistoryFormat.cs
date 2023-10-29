using System.Text.Json;

namespace EMT.Models.Formats
{
    public class ClinicalHistoryFormat : Format
    {

        public string Description { get; set; }

        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            }).ToString();
        }
    }
}
