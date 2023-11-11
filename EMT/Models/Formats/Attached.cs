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
        string NameFormat { get; set; }

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

        public bool IsValid(ClinicalHistoryFormat clinicalHistoryFormat)
        {
            // Verifica que todos los campos en Fields estén presentes en los campos válidos del formato
            foreach (var field in Fields)
            {
                // Buscar el campo en los campos válidos del formato
                var validField = clinicalHistoryFormat.ValidFields.FirstOrDefault(vf => vf.FieldName == field.Name);

                // Si no se encuentra el campo en los campos válidos, es inválido
                if (validField == null)
                {
                    Console.WriteLine($"Campo no válido: {field.Name}");
                    return false;
                }

                // Aquí puedes agregar más lógica de validación según sea necesario
                // ...

                // Por ejemplo, puedes verificar si el tipo del campo coincide
                if (field.Value.GetType().ToString() != validField.FieldType)
                {
                    Console.WriteLine($"Tipo de campo no válido para {field.Name}. Se esperaba {validField.FieldType} pero se encontró {field.GetType().ToString()}");
                    return false;
                }
                // Verificar si el valor está presente en las opciones si no está vacío
                if (!string.IsNullOrEmpty(field.Value.ToString()) && validField.FieldOptions != null && validField.FieldOptions.Any())
                {
                    if (!validField.FieldOptions.Contains(field.Value))
                    {
                        Console.WriteLine($"Valor no válido para {field.Name}. Se esperaba uno de {string.Join(", ", validField.FieldOptions)} pero se encontró {field.Value}");
                        return false;
                    }
                }
            }

            return true;
        }
    }
}
