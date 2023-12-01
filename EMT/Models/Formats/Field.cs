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
                var valueToken = json["Value"];

                // Convierte el valor según el tipo de dato
                object value = ConvertJsonValue(valueToken);

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
            if (jsonNode is JsonObject)
            {
                // Si es un objeto JSON, devuelve el objeto directamente
                return jsonNode.GetValue<object>();
            }
            else if (jsonNode is JsonArray)
            {
                var values = new List<object>();

                foreach (var item in (JsonArray)jsonNode)
                {
                    if (item is JsonValue jsonValue)
                    {
                        // Especifica el tipo al extraer el valor
                        values.Add(jsonValue.GetValue<object>());
                    }
                    else if (item is JsonObject obj)
                    {
                        values.Add(ConvertJsonValue(obj));
                    }
                    // Puedes agregar lógica adicional aquí para otros tipos si es necesario
                }

                return values;
            }
            else if (jsonNode is JsonValue jsonStringValue)
            {
                // Especifica el tipo al extraer el valor
                return jsonStringValue.GetValue<object>();
            }
            else
            {
                // Para otros tipos de nodos, devuelve el valor directamente
                return jsonNode.GetValue<object>();
            }
        }






    }
}
