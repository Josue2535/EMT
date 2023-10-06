using System.Text.Json;

namespace EMT.Models
{
    public class FieldsFormat
    {
        public Type FieldType { get; set; }
        public string FieldName { get; set; }
        public bool IsOptional { get; set; }
        public List<object> FieldOptions { get; set; }

        public FieldsFormat(Type fieldType, string fieldName, bool isOptional, List<object> fieldOptions = null)
        {
            FieldType = fieldType;
            FieldName = fieldName;
            IsOptional = isOptional;
            FieldOptions = fieldOptions ?? new List<object>();
        }

        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true // Hace que la salida JSON esté formateada
            });
        }
    }
}
