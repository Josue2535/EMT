using EMT.Models.Formats;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace EMT.Models.Implements
{
    public class Role
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public DateTime Created { get; set; }
        public string Name { get; set; }
        public List<Field> ValidFields { get; set; }


        // Método para convertir el objeto a formato JSON
        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            });
        }

        // Método para convertir desde JSON a un objeto Role
        public static Role FromJson(JsonObject json)
        {
            try
            {
                var id = json.ContainsKey("Id") ? new ObjectId(json["Id"].GetValue<string>()) : ObjectId.GenerateNewId();
                var created = json.ContainsKey("Created") ? json["Created"].GetValue<DateTime>(): new DateTime();
                var name = json["Name"].GetValue<string>();

                var validFields = new List<Field>();
                var validFieldsJsonArray = json["ValidFields"].AsArray();
                foreach (var fieldJson in validFieldsJsonArray)
                {
                    // Procesa cada campo y crea un objeto Field
                    

                    var field = Field.FromJson((JsonObject)fieldJson);

                    validFields.Add(field);
                }

                return new Role
                {
                    Id = id.ToString(),
                    Created = created,
                    Name = name,
                    ValidFields = validFields
                };
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a Role: {ex.Message}");
                return null;
            }
        }
        public bool IsFieldEnabled(string fieldName, string value)
        {
            // Buscar el ValidField por el nombre
            var field = ValidFields.FirstOrDefault(f => f.Name == fieldName);

            if (field != null)
            {
                // Verificar si el valor está presente en el array de valores del ValidField
                if (field.Value is List<string> stringList)
                {
                    return stringList.Contains(value);
                }

                // Si el campo es de otro tipo, puedes agregar lógica adicional aquí según tus necesidades
                // Por ejemplo, si el campo es un solo valor en lugar de una lista, puedes comparar directamente.
                // Si el campo es de un tipo diferente, debes ajustar esta lógica según lo que necesitas manejar.
            }

            // Si el ValidField no se encuentra, se considera como no habilitado
            return false;
        }
        public List<string> formats()
        {
            // Buscar el ValidField por el nombre
            var field = ValidFields.FirstOrDefault(f => f.Name == "formats");

            if (field != null)
            {
                // Verificar si el valor está presente en el array de valores del ValidField
                if (field.Value is List<string> stringList)
                {
                    return (List<string>)field.Value;
                }

                // Si el campo es de otro tipo, puedes agregar lógica adicional aquí según tus necesidades
                // Por ejemplo, si el campo es un solo valor en lugar de una lista, puedes comparar directamente.
                // Si el campo es de un tipo diferente, debes ajustar esta lógica según lo que necesitas manejar.
            }

            // Si el ValidField no se encuentra, se considera como no habilitado
            return new List<string>();
        }

    }
}
