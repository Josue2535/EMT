using Microsoft.AspNetCore.Mvc;
using EMT.Models.Formats;
using EMT.Services.Interface.Formats;
using System;
using System.Collections.Generic;
using MongoDB.Bson;
using System.Text.Json.Nodes;
using EMT.Services.Implements.Formats;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json;

namespace EMT.Controllers.Formats
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonalInformationFormatController : ControllerBase
    {
        private readonly IPersonalInformationFormatRepository _repository;

        public PersonalInformationFormatController(IPersonalInformationFormatRepository repository)
        {
            _repository = repository;
        }

        // GET: api/PersonalInformationFormat
        [HttpGet]
        public ActionResult<IEnumerable<PersonalInformationFormat>> Get()
        {
            try
            {
                var formats = _repository.GetAll();
                return Ok(formats);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET: api/PersonalInformationFormat/{id}
        [HttpGet("{id:length(24)}", Name = "GetPersonalInformationFormat")]
        public ActionResult<PersonalInformationFormat> Get(string id)
        {
            try
            {
                var format = _repository.GetById(new ObjectId(id));
                if (format == null)
                {
                    return NotFound();
                }
                return Ok(format);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // POST: api/PersonalInformationFormat
        [HttpPost]
        public ActionResult<PersonalInformationFormat> Post([FromBody] JsonObject format)
        {
            try
            {
                // Verifica si ya existe algún formato en la base de datos
                var existingFormat = _repository.GetAll();

                if (!existingFormat.IsNullOrEmpty())
                {
                    // Ya existe un formato, retorna un error
                    return Conflict("Ya existe un formato de historia clínica en la base de datos.");
                }
                // Convierte manualmente el JSON a un objeto ClinicalHistoryFormat
                var personalInformationFormat = PersonalInformationFormat.GetFromJson(format);

                // Implementa la lógica para crear un nuevo formato
                _repository.Create(personalInformationFormat);

                return CreatedAtRoute("GetClinicalHistoryFormatById", new { id = personalInformationFormat.Id }, personalInformationFormat);
            }
            catch (JsonException)
            {
                // Maneja errores de deserialización de JSON
                return BadRequest("Formato JSON no válido");
            }
        }

        // PUT: api/PersonalInformationFormat/{id}
        [HttpPut("{id:length(24)}")]
        public IActionResult Put(string id, [FromBody] JsonObject json)
        {
            // Implementa la lógica para actualizar un formato existente
            var existingFormat = _repository.GetById(new ObjectId(id));

            if (existingFormat == null)
            {
                return NotFound();
            }

            // Actualiza las propiedades necesarias
            existingFormat = PersonalInformationFormat.GetFromJson(json);

            _repository.Update(existingFormat);

            return NoContent();
        }
        

        // DELETE: api/PersonalInformationFormat/{id}
        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            try
            {
                var format = _repository.GetById(new ObjectId(id));
                if (format == null)
                {
                    return NotFound();
                }

                _repository.Delete(format.Id.Value);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
