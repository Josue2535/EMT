﻿using MongoDB.Bson;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace EMT.Models.Formats
{
    public class ClinicalHistoryFormat : Format
    {
        public string Name { get; set; }
        public string Description { get; set; }

        public string ToJson()
        {
            return JsonSerializer.Serialize(this, new JsonSerializerOptions
            {
                WriteIndented = true
            }).ToString();
        }

        public static ClinicalHistoryFormat GetFromJson(JsonObject json)
        {
            try
            {
                var id = json.ContainsKey("Id") ? json["Id"].GetValue<string>() : ObjectId.GenerateNewId().ToString();
                string name = json["name"].GetValue<string>();
                // Aquí deberías extraer cada propiedad del objeto `json` y asignarla al objeto `ClinicalHistoryFormat`
                string description = json["Description"].GetValue<string>();  // Asegúrate de manejar los tipos de datos adecuadamente
                

                
                DateTime creationDate = json.ContainsKey("CreationDate") ? json["CreationDate"].GetValue<DateTime>() : DateTime.Now;  // Ajusta el formato de fecha según tus necesidades
                
                List<FieldsFormat> validFields = new List<FieldsFormat>();
                var validFieldsJsonArray = json["ValidFields"].AsArray();
                foreach (var fieldJson in validFieldsJsonArray)
                {
                    // Procesa cada campo y crea un objeto FieldsFormat
                    string fieldType = fieldJson["FieldType"].GetValue<string>();
                    string fieldName = fieldJson["FieldName"].GetValue<string>();
                    bool isOptional = fieldJson["IsOptional"].GetValue<bool>();
                    var FieldOptionsJson = fieldJson["FieldOptions"].AsArray();
                    var FieldOptions = new List<string>();
                    foreach (var fieldOptionJson in FieldOptionsJson) {
                        FieldOptions.Add(fieldOptionJson.GetValue<string>());
                    }
                    FieldsFormat field = new FieldsFormat
                    {
                        FieldType = fieldType,
                        FieldName = fieldName,
                        IsOptional = isOptional,
                        FieldOptions = FieldOptions
                    };

                    validFields.Add(field);
                }

                ClinicalHistoryFormat clinicalHistory = new ClinicalHistoryFormat
                {
                    Description = description,
                    Id = id,
                    CreationDate = creationDate,
                    ValidFields = validFields,
                    Name = name,
                };

                return clinicalHistory;
            }
            catch (Exception ex)
            {
                // Maneja cualquier error durante el proceso de conversión
                Console.WriteLine($"Error al convertir JsonObject a ClinicalHistoryFormat: {ex.Message}");
                return null;
            }
        }
    }
}
