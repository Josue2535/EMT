using EMT.Models.Formats;
using EMT.Services.Interface.Formats;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using System.Text.Json;

namespace EMT.Services.Implements.Formats
{
    public class ClinicalHistoryFormatRepository : IClinicalHistoryFormatRepository
    {
        private readonly IMongoCollection<ClinicalHistoryFormat> _collection;

        public ClinicalHistoryFormatRepository(string connectionString, string databaseName, string collectionName)
        {
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);
            _collection = database.GetCollection<ClinicalHistoryFormat>(collectionName);
        }

        public ClinicalHistoryFormat GetById(string id)
        {
            var objectId = id;
            return _collection.Find(new BsonDocument("_id", objectId)).SingleOrDefault();
        }

        public IEnumerable<ClinicalHistoryFormat> GetAll()
        {
            return _collection.Find(_ => true).ToList();
        }

        public void Create(ClinicalHistoryFormat entity)
        {
            _collection.InsertOne(entity);
        }

        public void Update(ClinicalHistoryFormat entity)
        {
            var filter = Builders<ClinicalHistoryFormat>.Filter.Eq("_id", entity.Id);
            _collection.ReplaceOne(filter, entity);
        }

        public void Delete(string id)
        {
            var objectId = new ObjectId(id);
            _collection.DeleteOne(new BsonDocument("_id", objectId));
        }

        public bool IsClinicalHistoryFormatValid(string json)
    {
        // Obtener el último formato de historia clínica creado
        var lastFormat = _collection.Find(_ => true).SortByDescending(f => f.CreationDate).Limit(1).FirstOrDefault();

        if (lastFormat == null)
        {
            // No hay formatos de historia clínica creados aún
            return false;
        }

        // Convertir el JSON proporcionado a un objeto dynamic para facilitar la validación
        dynamic jsonData = JsonConvert.DeserializeObject(json);

        // Iterar sobre los campos válidos del último formato y verificar la validez
        foreach (var field in lastFormat.ValidFields)
        {
            // Verificar que el campo exista en el JSON
            if (jsonData[field.FieldName] == null)
            {
                return false;
            }

            // Verificar el tipo del campo
            var fieldType = field.FieldType;
            var fieldValue = jsonData[field.FieldName];

            if (!IsTypeValid(fieldType, fieldValue))
            {
                return false;
            }

            // Verificar opciones del campo si las tiene
            if (field.FieldOptions.Any() && !field.FieldOptions.Contains(fieldValue))
            {
                return false;
            }
        }

        // Todos los campos del JSON cumplen con las validaciones
        return true;
    }

        private bool IsTypeValid(string expectedType, JsonElement value)
        {
            // Verificar que el tipo del valor coincida con el tipo esperado
            return value.ValueKind switch
            {
                JsonValueKind.String => expectedType == "string",
                JsonValueKind.Number => expectedType == "number",
                // Agregar más casos según sea necesario para otros tipos
                _ => false,
            };
        }

        public void Delete(ObjectId id)
        {
            var filter = Builders<ClinicalHistoryFormat>.Filter.Eq("_id", id);
            _collection.DeleteOne(filter);
        }

        public IEnumerable<ClinicalHistoryFormat> GetAll(List<string> list)
        {
            // Filtrar los formatos por los nombres proporcionados en la lista
            var filter = Builders<ClinicalHistoryFormat>.Filter.In("Name", list);

            // Obtener los formatos que cumplen con el filtro
            return _collection.Find(filter).ToList();
        }
    }
}
