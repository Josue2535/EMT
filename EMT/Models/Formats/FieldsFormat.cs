using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;

namespace EMT.Models.Formats
{
    public class FieldsFormat
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId? Id { get; set; }
        public string FieldType { get; set; }
        public string FieldName { get; set; }
        public bool IsOptional { get; set; }
        public List<object> FieldOptions { get; set; }

        

        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true // Hace que la salida JSON esté formateada
            });
        }
    }
}
