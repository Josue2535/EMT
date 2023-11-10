using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

namespace EMT.Models.Formats
{
    public class Field
    {
        public string Name { get; set; }
        public object Value { get; set; }

        // Constructor por defecto
        public Field()
        {
        }

        // Constructor con parámetros para facilitar la creación de instancias
        public Field(string name, object value)
        {
            Name = name;
            Value = value;
        }

        public static Field FromJson(JsonObject json)
        {
            try
            {
                string name = json["Name"].GetValue<string>();
                object value = ConvertJsonValue(json["Value"]);

                // Crea un nuevo objeto Field con los valores obtenidos
                Field field = new Field
                {
                    Name = name,
                    Value = value
                };

                return field;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a Field: {ex.Message}");
                return null;
            }
        }

        private static object ConvertJsonValue(JsonNode jsonNode)
        {
            return jsonNode.GetValue<object>();
        }
    }
}
