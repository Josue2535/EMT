using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace EMT.Models.Formats
{
    public class Attached
    {
        public string id { get; set; }
        public DateTime Created { get; set; }
        public List<Field> Fields { get; set; }
        public string NameFormat { get; set; }

        // Constructor por defecto
        public Attached()
        {
            Created = DateTime.Now;
            Fields = new List<Field>();
        }

        // Método para convertir el objeto a formato JSON
        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }

        // Método para convertir desde JSON a un objeto Attached
        public static Attached FromJson(JsonObject json)
        {
            try
            {
                string id = json.ContainsKey("Id") ? json["Id"].GetValue<string>() : ObjectId.GenerateNewId().ToString();
                DateTime created = json.ContainsKey("Created") ? json["Created"].GetValue<DateTime>() : DateTime.Now;
                string name = json["NameFormat"].GetValue<string>();
                List<Field> fields = new List<Field>();
                var fieldsJsonArray = json["Fields"].AsArray();
                foreach (var fieldJson in fieldsJsonArray)
                {
                    // Procesa cada campo y crea un objeto Field
                    Field field = Field.FromJson((JsonObject)fieldJson);
                    fields.Add(field);
                }

                // Crea un nuevo objeto Attached con los valores obtenidos
                Attached attached = new Attached
                {
                    id = id,
                    NameFormat = name,
                    Created = created,
                    Fields = fields
                };

                return attached;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a Attached: {ex.Message}");
                return null;
            }
        }

        
        public bool IsValid(ClinicalHistoryFormat format)
        {
            try
            {
                foreach (var field in Fields)
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
}
