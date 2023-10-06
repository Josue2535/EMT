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
    }
}
