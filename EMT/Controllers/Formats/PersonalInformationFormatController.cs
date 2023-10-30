using Microsoft.AspNetCore.Mvc;
using EMT.Models.Formats;
using EMT.Services.Interface.Formats;
using System;
using System.Collections.Generic;

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
                var format = _repository.GetById(id);
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
        public ActionResult<PersonalInformationFormat> Post([FromBody] PersonalInformationFormat format)
        {
            try
            {
                _repository.Create(format);
                return CreatedAtRoute("GetPersonalInformationFormat", new { id = format.Id }, format);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // PUT: api/PersonalInformationFormat/{id}
        [HttpPut("{id:length(24)}")]
        public IActionResult Put(string id, [FromBody] PersonalInformationFormat updatedFormat)
        {
            try
            {
                var existingFormat = _repository.GetById(id);
                if (existingFormat == null)
                {
                    return NotFound();
                }

                updatedFormat.Id = existingFormat.Id;
                _repository.Update(updatedFormat);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // DELETE: api/PersonalInformationFormat/{id}
        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            try
            {
                var format = _repository.GetById(id);
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
