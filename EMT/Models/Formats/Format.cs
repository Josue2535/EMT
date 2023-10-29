using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;

namespace EMT.Models.Formats
{
    public class Format
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId? Id { get; set; }
        public DateTime CreationDate { get; set; }

        
        public List<FieldsFormat> ValidFields { get; set; }

        

        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }
    }
}
