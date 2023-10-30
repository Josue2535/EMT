using EMT.Models.Formats;
using EMT.Services.Interface.Formats;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EMT.Controllers
{
    [ApiController]
    [Route("[controller]")]
    
    public class ClinicalHistoryFormatController : ControllerBase
    {
        private readonly IClinicalHistoryFormatRepository _clinicalHistoryFormatRepository;

        public ClinicalHistoryFormatController(IClinicalHistoryFormatRepository clinicalHistoryFormatRepository)
        {
            _clinicalHistoryFormatRepository = clinicalHistoryFormatRepository;
        }

        [HttpGet(Name = "GetClinicalHistoryFormats")]
        public IEnumerable<ClinicalHistoryFormat> Get()
        {
            // Implementa la lógica para obtener todos los formatos
            var formats = _clinicalHistoryFormatRepository.GetAll();
            return formats;
        }

        [HttpGet("{id}", Name = "GetClinicalHistoryFormatById")]
        public IActionResult Get(string id)
        {
            // Implementa la lógica para obtener un formato por su ID
            var format = _clinicalHistoryFormatRepository.GetById(id);

            if (format == null)
            {
                return NotFound();
            }

            return Ok(format);
        }

        [HttpPost(Name = "CreateClinicalHistoryFormat")]
        public IActionResult Post([FromBody] ClinicalHistoryFormat clinicalHistoryFormat)
        {
            // Implementa la lógica para crear un nuevo formato
            _clinicalHistoryFormatRepository.Create(clinicalHistoryFormat);

            return CreatedAtRoute("GetClinicalHistoryFormatById", new { id = clinicalHistoryFormat.Id }, clinicalHistoryFormat);
        }

        [HttpPut("{id}", Name = "UpdateClinicalHistoryFormat")]
        public IActionResult Put(string id, [FromBody] ClinicalHistoryFormat clinicalHistoryFormat)
        {
            // Implementa la lógica para actualizar un formato existente
            var existingFormat = _clinicalHistoryFormatRepository.GetById(id);

            if (existingFormat == null)
            {
                return NotFound();
            }

            // Actualiza las propiedades necesarias
            existingFormat.Description = clinicalHistoryFormat.Description;

            _clinicalHistoryFormatRepository.Update(existingFormat);

            return NoContent();
        }

        [HttpDelete("{id}", Name = "DeleteClinicalHistoryFormat")]
        public IActionResult Delete(string id)
        {
            // Implementa la lógica para eliminar un formato por su ID
            var existingFormat = _clinicalHistoryFormatRepository.GetById(id);

            if (existingFormat == null)
            {
                return NotFound();
            }

            _clinicalHistoryFormatRepository.Delete(new ObjectId(id));

            return NoContent();
        }
    }

}
