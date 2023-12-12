using EMT.Models.Formats;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace EMT.Models.Implements
{
    public class PersonalInformation
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public DateTime Created { get; set; }
        public List<Field> FieldList { get; set; }

        

        // Método para convertir el objeto a formato JSON
        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }

        // Método para convertir desde JSON a un objeto PersonalInformation
        public static PersonalInformation FromJson(JsonObject json)
        {
            try
            {
                // Aquí deberías extraer cada propiedad del objeto `json` y asignarla al objeto `PersonalInformation`
                var id = json.ContainsKey("Id") ? json["Id"].GetValue<string>() : ObjectId.GenerateNewId().ToString();
                DateTime created = json.ContainsKey("Created") ? json["Created"].GetValue<DateTime>() : DateTime.Now;

                List<Field> fieldList = new List<Field>();
                var fieldListJsonArray = json.ContainsKey("FieldList") ? json["FieldList"].AsArray() : new JsonArray();

                foreach (var fieldJson in fieldListJsonArray)
                {
                    // Procesa cada campo y crea un objeto Field
                    Field field = Field.FromJson((JsonObject)fieldJson);

                    fieldList.Add(field);
                }

                // Crea un nuevo objeto PersonalInformation con los valores obtenidos
                PersonalInformation personalInformation = new PersonalInformation
                {
                    Id = id,
                    Created = created,
                    FieldList = fieldList
                };

                return personalInformation;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a PersonalInformation: {ex.Message}");
                return null;
            }
        }
        public bool IsValid(PersonalInformationFormat format)
        {
            try
            {
                foreach (var field in FieldList)
                {
                    var validField = format.ValidFields.FirstOrDefault(vf => vf.FieldName == field.Name);

                    if (validField == null)
                    {
                        Console.WriteLine($"Campo no válido: {field.Name}");
                        return false;
                    }

                    if (!IsValidFieldType(field, validField))
                    {
                        return false;
                    }

                    if (!IsValidFieldValue(field, validField))
                    {
                        return false;
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al validar el formato del paciente: {ex.Message}");
                return false;
            }
        }

        private bool IsValidFieldType(Field field, FieldsFormat validField)
        {
            var ret = field.IsValidFieldType(field, validField);
            return ret;
        }

        private bool IsValidFieldValue(Field field, FieldsFormat validField)
        {
            try
            {
                var fieldValueString = field.Value?.ToString();

                if (!string.IsNullOrEmpty(fieldValueString) && validField.FieldOptions != null && validField.FieldOptions.Any())
                {
                    if (!validField.FieldOptions.Contains(fieldValueString))
                    {
                        Console.WriteLine($"Valor no válido para {field.Name}. Se esperaba uno de {string.Join(", ", validField.FieldOptions)} pero se encontró {fieldValueString}");
                        return false;
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al validar el valor del campo para {field.Name}: {ex.Message}");
                return false;
            }
        }
    }
}
