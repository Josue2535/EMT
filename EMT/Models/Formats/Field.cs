using System.Text.Json.Nodes;

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
                object value = json["Value"].GetValue<object>();

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
    }
}
