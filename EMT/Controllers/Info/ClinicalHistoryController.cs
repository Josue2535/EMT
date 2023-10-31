using Microsoft.AspNetCore.Mvc;
using EMT.Services.Interface.Info;
using System;
using System.Collections.Generic;
using EMT.Models.DAO;
using MongoDB.Bson;
using EMT.Models.Formats;
using System.Text.Json.Nodes;

namespace EMT.Controllers.Info
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClinicalHistoryController : ControllerBase
    {
        private readonly IClinicalHistoryRepository _repository;

        public ClinicalHistoryController(IClinicalHistoryRepository repository)
        {
            _repository = repository;
        }

        // GET: api/ClinicalHistory
        [HttpGet]
        public ActionResult<IEnumerable<ClinicalHistory>> Get()
        {
            try
            {
                var clinicalHistories = _repository.GetAll();
                return Ok(clinicalHistories);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET: api/ClinicalHistory/{id}
        [HttpGet("{id}", Name = "GetClinicalHistory")]
        public ActionResult<ClinicalHistory> Get(string id)
        {
            try
            {
                var clinicalHistory = _repository.GetById(new ObjectId(id));
                if (clinicalHistory == null)
                {
                    return NotFound();
                }
                return Ok(clinicalHistory);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // POST: api/ClinicalHistory
        [HttpPost]
        public ActionResult<ClinicalHistory> Post([FromBody] ClinicalHistory clinicalHistory)
        {
            try
            {
                _repository.Create(clinicalHistory);
                return CreatedAtRoute("GetClinicalHistory", new { id = clinicalHistory.Id }, clinicalHistory);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }
        //Post Anexo
        [HttpPost("/atachett") ]
        public ActionResult<ClinicalHistory> PostAttached(string id, [FromBody] JsonObject clinicalHistory)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // PUT: api/ClinicalHistory/{id}
        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] ClinicalHistory updatedClinicalHistory)
        {
            try
            {
                var existingClinicalHistory = _repository.GetById(new ObjectId(id));
                if (existingClinicalHistory == null)
                {
                    return NotFound();
                }

                updatedClinicalHistory.Id = existingClinicalHistory.Id;
                _repository.Update(updatedClinicalHistory);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // DELETE: api/ClinicalHistory/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            try
            {
                var clinicalHistory = _repository.GetById(new ObjectId(id));
                if (clinicalHistory == null)
                {
                    return NotFound();
                }

                _repository.Delete(clinicalHistory.Id.Value);
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
