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
            if (jsonNode is JsonObject jsonObject)
            {
                // Si es un objeto JSON, devuelve el objeto directamente
                return jsonObject.GetValue<object>();
            }
            else if (jsonNode is JsonArray jsonArray)
            {
                var values = new List<object>();

                foreach (var item in jsonArray)
                {
                    if (item is JsonValue jsonValue)
                    {
                        // Si el valor es un JsonValue, extrae el valor directamente como cadena
                        values.Add(jsonValue.GetValue<string>());
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
                // Si es un valor, devuelve el valor directamente como cadena
                return jsonStringValue.GetValue<string>();
            }
            else
            {
                // Para otros tipos de nodos, devuelve el valor directamente
                return jsonNode.GetValue<object>();
            }
        }



    }
}
