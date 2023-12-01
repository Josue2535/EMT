using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace EMT.Models.Formats
{
    public class FieldsFormat
    {
        
        public string FieldType { get; set; }
        public string FieldName { get; set; }
        public bool IsOptional { get; set; }

        public List<string> FieldOptions { get; set; }

        

        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }
        public static FieldsFormat FromJson(JsonObject json)
        {
            try
            {
                string fieldType = json.ContainsKey("FieldType") ? json["FieldType"].GetValue<string>() : "";
                string fieldName = json.ContainsKey("FieldName") ? json["FieldName"].GetValue<string>() : "";
                bool isOptional = json.ContainsKey("IsOptional") ? json["IsOptional"].GetValue<bool>() : false;

                var fieldOptionsJsonArray = json.ContainsKey("FieldOptions") ? json["FieldOptions"].AsArray() : new JsonArray();
                var fieldOptions = new List<string>();

                foreach (var optionJson in fieldOptionsJsonArray)
                {
                    // Procesa cada opción y agrega al listado
                    fieldOptions.Add(optionJson.GetValue<string>());
                }

                // Crea un nuevo objeto FieldsFormat con los valores obtenidos
                FieldsFormat fieldsFormat = new FieldsFormat
                {
                    FieldType = fieldType,
                    FieldName = fieldName,
                    IsOptional = isOptional,
                    FieldOptions = fieldOptions
                };

                return fieldsFormat;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a FieldsFormat: {ex.Message}");
                return null;
            }
        }
    }
}
