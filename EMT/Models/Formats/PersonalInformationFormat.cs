using MongoDB.Bson;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace EMT.Models.Formats
{
    public class PersonalInformationFormat : Format
    {
        


        // Método para convertir el objeto a formato JSON
        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }
        public static PersonalInformationFormat GetFromJson(JsonObject json)
        {
            try
            {
                string id = new ObjectId().ToString();
                if (json.ContainsKey("Id"))
                {
                    id = json["Id"].GetValue<string>();
                }


                DateTime creationDate = json["CreationDate"].GetValue<DateTime>();  // Ajusta el formato de fecha según tus necesidades

                List<FieldsFormat> validFields = new List<FieldsFormat>();
                var validFieldsJsonArray = json["ValidFields"].AsArray();
                foreach (var fieldJson in validFieldsJsonArray)
                {
                    // Procesa cada campo y crea un objeto FieldsFormat
                    string fieldType = fieldJson["FieldType"].GetValue<string>();
                    string fieldName = fieldJson["FieldName"].GetValue<string>();
                    bool isOptional = fieldJson["IsOptional"].GetValue<bool>();
                    var FieldOptionsJson = fieldJson["FieldOptions"].AsArray();
                    var FieldOptions = new List<string>();
                    foreach (var fieldOptionJson in FieldOptionsJson)
                    {
                        FieldOptions.Add(fieldOptionJson.GetValue<string>());
                    }
                    FieldsFormat field = new FieldsFormat
                    {
                        FieldType = fieldType,
                        FieldName = fieldName,
                        IsOptional = isOptional,
                        FieldOptions = FieldOptions
                    };

                    validFields.Add(field);
                }

                PersonalInformationFormat personalInformationFormat = new PersonalInformationFormat
                {
                    Id = id,
                    CreationDate = creationDate,
                    ValidFields = validFields
                };

                return personalInformationFormat;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a ClinicalHistoryFormat: {ex.Message}");
                return null;
            }
        }
    }
}
