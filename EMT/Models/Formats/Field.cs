using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

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
                //string valueToken = json["Value"].GetValue<string>();

                // Convierte el valor según el tipo de dato
                object value = ConvertJsonValue(valueToken, name);

                // Crea un nuevo objeto Field con los valores obtenidos
                Field field = new Field
                {
                    Name = name,
                    Value = value
                };

                Console.WriteLine(field.Value.GetType());

                return field;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a Field: {ex.Message}");
                return null;
            }
        }
        private static object ConvertJsonValue(JsonNode jsonNode,String name)
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
                    if (!item["fields"].AsArray().IsNullOrEmpty())
                    {
                        List<Field> fields = new List<Field>();
                        var fieldsJsonArray = item["fields"].AsArray();
                        foreach (var fieldJson in fieldsJsonArray)
                        {
                            // Procesa cada campo y crea un objeto Field
                            Field field = Field.FromJson((JsonObject)fieldJson);
                            fields.Add(field);
                        }
                        values.Add(fields);
                    }
                        else if (item is JsonObject fieldObject)
                    {
                        
                            values.Add(ConvertJsonValue(fieldObject));
                        

                        // Recursivamente convierte los objetos de la lista
                        
                    }
                    if (item is JsonValue jsonValue)
                    {
                        // Especifica el tipo al extraer el valor
                        values.Add(jsonValue.GetValue<string>());
                    }
                    
                    // Puedes agregar lógica adicional aquí para otros tipos si es necesario
                }

                return values;
            }
            else if (jsonNode is JsonValue jsonStringValue)
            {
                return jsonStringValue.GetValue<object>();
            }
            else
            {
                // Para otros tipos de nodos, devuelve el valor directamente
                return jsonNode.GetValue<object>();
            }
        }
        // Resto del código...

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
                // Verifica si el valor es una cadena codificada en base64
                string stringValue = jsonStringValue.GetValue<string>();
                if (IsBase64String(stringValue))
                {
                    // Convierte la cadena base64 a un array de bytes
                    return Convert.FromBase64String(stringValue);
                }
                else
                {
                    // Si no es una cadena base64, devuelve el valor directamente
                    return jsonStringValue.GetValue<string>();
                }
            }
            else
            {
                // Para otros tipos de nodos, devuelve el valor directamente
                return jsonNode.GetValue<object>();
            }
        }

        // Método para verificar si una cadena es una cadena codificada en base64
        private static bool IsBase64String(string s)
        {
            s = s.Trim();
            return (s.Length % 4 == 0) && Regex.IsMatch(s, @"^[a-zA-Z0-9\+/]*={0,3}$", RegexOptions.None);
        }

        public bool IsValidFieldType(Field field, FieldsFormat validField)
        {
            try
            {
                var expectedFieldType = validField.FieldType;
                var actualFieldType = field.Value is IConvertible ? field.Value.GetType().Name : field.Value.GetType().ToString();

                if (expectedFieldType != actualFieldType)
                {
                    switch (expectedFieldType)
                    {
                        case "String":
                            // Conversión a String
                            field.Value = field.Value?.ToString();

                            break;

                        case "Number":
                        case "Integer":
                            // Conversión a Number (Int)
                            if (Int32.TryParse(field.Value?.ToString(), out int intValue))
                            {
                                field.Value = intValue;
                            }
                            else
                            {
                                Console.WriteLine($"Error al convertir {field.Name} a Number. Valor no válido.");
                                return false;
                            }
                            break;

                        case "LocalDate":
                            // Intenta convertir a DateTime utilizando DateTime.TryParse
                            if (DateTime.TryParse(field.Value?.ToString(), out DateTime dateValue))
                            {
                                field.Value = dateValue;
                            }
                            else
                            {
                                Console.WriteLine($"Error al convertir {field.Name} a Date. Valor no válido.");
                                return false;
                            }
                            break;

                        case "Image":
                            // Aquí puedes manejar la lógica para el tipo de campo "Image"
                            // Puedes guardar la imagen, validar el formato, etc.
                            // Por ejemplo, podrías guardar la imagen como byte[] en tu modelo
                            byte[] imageBytes = Convert.FromBase64String(field.Value?.ToString());
                            field.Value = imageBytes;
                            break;
                        case "Attachment":
                            // Aquí puedes manejar la lógica para el tipo de campo "Image"
                            // Puedes guardar la imagen, validar el formato, etc.
                            // Por ejemplo, podrías guardar la imagen como byte[] en tu modelo
                            
                            break;

                        // Puedes agregar más casos según tus necesidades

                        default:
                            Console.WriteLine($"Tipo de campo no reconocido: {expectedFieldType}");
                            return false;
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al validar el tipo de campo para {field.Name}: {ex.Message}");
                return false;
            }
        }





    }
}
