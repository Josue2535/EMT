using Microsoft.AspNetCore.Mvc;
using EMT.Services.Interface.Info;
using System;
using System.Collections.Generic;
using EMT.Models.Implements;
using MongoDB.Bson;

namespace EMT.Controllers.Info
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacientController : ControllerBase
    {
        private readonly IPacientRepository _repository;

        public PacientController(IPacientRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Pacient
        [HttpGet]
        public ActionResult<IEnumerable<Pacient>> Get()
        {
            try
            {
                var pacients = _repository.GetAll();
                return Ok(pacients);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET: api/Pacient/{id}
        [HttpGet("{id}", Name = "GetPacient")]
        public ActionResult<Pacient> Get(string id)
        {
            try
            {
                var pacient = _repository.GetById(id);
                if (pacient == null)
                {
                    return NotFound();
                }
                return Ok(pacient);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // POST: api/Pacient
        [HttpPost]
        public ActionResult<Pacient> Post([FromBody] Pacient pacient)
        {
            try
            {
                _repository.Create(pacient);
                return CreatedAtRoute("GetPacient", new { id = pacient.Id }, pacient);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // PUT: api/Pacient/{id}
        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] Pacient updatedPacient)
        {
            try
            {
                var existingPacient = _repository.GetById(id);
                if (existingPacient == null)
                {
                    return NotFound();
                }

                updatedPacient.Id = existingPacient.Id;
                _repository.Update(updatedPacient);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // DELETE: api/Pacient/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            try
            {
                var pacient = _repository.GetById(id);
                if (pacient == null)
                {
                    return NotFound();
                }

                _repository.Delete(new ObjectId (pacient.Id));
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
