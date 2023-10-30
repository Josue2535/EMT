using Microsoft.AspNetCore.Mvc;
using EMT.Services.Interface.Info;
using System;
using System.Collections.Generic;
using EMT.Models.Implements;

namespace EMT.Controllers.Info
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonalInformationController : ControllerBase
    {
        private readonly IPersonalInformationRepository _repository;

        public PersonalInformationController(IPersonalInformationRepository repository)
        {
            _repository = repository;
        }

        // GET: api/PersonalInformation
        [HttpGet]
        public ActionResult<IEnumerable<PersonalInformation>> Get()
        {
            try
            {
                var personalInformations = _repository.GetAll();
                return Ok(personalInformations);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET: api/PersonalInformation/{id}
        [HttpGet("{id}", Name = "GetPersonalInformation")]
        public ActionResult<PersonalInformation> Get(string id)
        {
            try
            {
                var personalInformation = _repository.GetById(id);
                if (personalInformation == null)
                {
                    return NotFound();
                }
                return Ok(personalInformation);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // POST: api/PersonalInformation
        [HttpPost]
        public ActionResult<PersonalInformation> Post([FromBody] PersonalInformation personalInformation)
        {
            try
            {
                _repository.Create(personalInformation);
                return CreatedAtRoute("GetPersonalInformation", new { id = personalInformation.Id }, personalInformation);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // PUT: api/PersonalInformation/{id}
        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] PersonalInformation updatedPersonalInformation)
        {
            try
            {
                var existingPersonalInformation = _repository.GetById(id);
                if (existingPersonalInformation == null)
                {
                    return NotFound();
                }

                updatedPersonalInformation.Id = existingPersonalInformation.Id;
                _repository.Update(updatedPersonalInformation);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // DELETE: api/PersonalInformation/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            try
            {
                var personalInformation = _repository.GetById(id);
                if (personalInformation == null)
                {
                    return NotFound();
                }

                _repository.Delete(new MongoDB.Bson.ObjectId(personalInformation.Id));
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
