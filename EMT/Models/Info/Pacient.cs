using EMT.Models.Formats;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace EMT.Models.Implements
{
    public class Pacient
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public DateTime Created { get; set; }

        public string? Role { get; set; }
        public List<Field> FieldsList { get; set; }
        public string PersonalInformationId { get; set; }
        public bool IsEnabled { get; set; }

       

        // Método para convertir el objeto a formato JSON
        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }

        // Método para convertir desde JSON a un objeto Paciente
        public static Pacient FromJson(JsonObject json)
        {
            try
            {
                // Aquí deberías extraer cada propiedad del objeto `json` y asignarla al objeto `Pacient`
                string id = json.ContainsKey("Id") ? json["Id"].GetValue<string>() : ObjectId.GenerateNewId().ToString();
                string role = json.ContainsKey("Role") ? json["Role"].GetValue<string>() : "";
                DateTime created = json.ContainsKey("Created") ? json["Created"].GetValue<DateTime>() : DateTime.Now;

                List<Field> fieldsList = new List<Field>();
                var fieldsListJsonArray = json.ContainsKey("FieldsList") ? json["FieldsList"].AsArray() : new JsonArray();

                foreach (var fieldJson in fieldsListJsonArray)
                {
                    // Procesa cada campo y crea un objeto Field
                    Field field = Field.FromJson((JsonObject)fieldJson);

                    fieldsList.Add(field);
                }

                string personalInformation = json.ContainsKey("PersonalInformationId") ? json["PersonalInformationId"].GetValue<string>() : null;

                // Crea un nuevo objeto Pacient con los valores obtenidos
                Pacient pacient = new Pacient
                {
                    Id = id,
                    Role = role,
                    Created = created,
                    FieldsList = fieldsList,
                    PersonalInformationId = personalInformation,
                    IsEnabled = json.ContainsKey("IsEnabled") ? json["IsEnabled"].GetValue<bool>() : false
                };

                return pacient;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a Pacient: {ex.Message}");
                return null;
            }
        }

        public bool IsValid(PacientFormat format)
        {
            try
            {
                foreach (var field in FieldsList)
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
            try
            {
                var expectedFieldType = validField.FieldType;
                var actualFieldType = field.Value is IConvertible ? field.Value.GetType().Name : field.Value.GetType().ToString();

                if (expectedFieldType != actualFieldType)
                {
                    Console.WriteLine($"Tipo de campo no válido para {field.Name}. Se esperaba {expectedFieldType} pero se encontró {actualFieldType}");
                    return false;
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al validar el tipo de campo para {field.Name}: {ex.Message}");
                return false;
            }
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

