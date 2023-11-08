using System;
using System.Collections.Generic;
using System.Text.Json.Nodes;
using EMT.Models.Formats;
using EMT.Services.Interface.Formats;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace EMT.Controllers.Formats
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacientFormatController : ControllerBase
    {
        private readonly IPacientFormatRepository _repository;

        public PacientFormatController(IPacientFormatRepository repository)
        {
            _repository = repository;
        }

        // GET: api/PacientFormat
        [HttpGet]
        public ActionResult<IEnumerable<PacientFormat>> Get()
        {
            try
            {
                var formats = _repository.GetAll();
                return Ok(formats);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
            }
        }

        // GET: api/PacientFormat/{id}
        [HttpGet("{id:length(24)}", Name = "GetPacientFormat")]
        public ActionResult<PacientFormat> Get(string id)
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
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
            }
        }

        // POST: api/PacientFormat
        [HttpPost]
        public ActionResult<PacientFormat> Post(JsonObject format)
        {
            try
            {
                var pacientFormat = PacientFormat.GetFromJson(format);
                _repository.Create(pacientFormat);
                return CreatedAtRoute("GetPacientFormat", new { id = pacientFormat.Id.ToString() }, format);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
            }
        }

        // PUT: api/PacientFormat/{id}
        [HttpPut("{id:length(24)}")]
        public IActionResult Put(string id, JsonObject updatedFormat)
        {
            try
            {
                var updatePacientFormat = PacientFormat.GetFromJson(updatedFormat);
                var existingFormat = _repository.GetById(id);
                if (existingFormat == null)
                {
                    return NotFound();
                }

                updatePacientFormat.Id = existingFormat.Id;
                _repository.Update(updatePacientFormat);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
            }
        }

        // DELETE: api/PacientFormat/{id}
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

                _repository.Delete(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
            }
        }
    }
}
