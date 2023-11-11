using Microsoft.AspNetCore.Mvc;
using EMT.Services.Interface.Info;
using System;
using System.Collections.Generic;
using EMT.Models.DAO;
using MongoDB.Bson;
using EMT.Models.Formats;
using System.Text.Json.Nodes;
using EMT.Services.Implements.Formats;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using EMT.Services.Interface.Formats;

namespace EMT.Controllers.Info
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClinicalHistoryController : ControllerBase
    {

        private readonly IClinicalHistoryRepository _repository;
        private readonly IRoleRepository _RoleRepository;
        private readonly IClinicalHistoryFormatRepository _clinicalHistoryFormatRepository;
        public ClinicalHistoryController(IClinicalHistoryRepository repository, IRoleRepository roleRepository, IClinicalHistoryFormatRepository clinicalHistoryFormatRepository)
        {
            _repository = repository;
            _RoleRepository = roleRepository;
            _clinicalHistoryFormatRepository = clinicalHistoryFormatRepository;
        }

        // GET: api/ClinicalHistory
        [HttpGet]
        public ActionResult<IEnumerable<ClinicalHistory>> Get()
        {
            try
            {
                if (!hasAccess("ClinicalHistory", "Get"))
                {
                    return Unauthorized();
                }
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
                if (!hasAccess("ClinicalHistory", "Get"))
                {
                    return Unauthorized();
                }
                var clinicalHistory = _repository.GetById(id);
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

        // GET: api/ClinicalHistory/user/{id}
        [HttpGet("user/{id}", Name = "GetClinicalHistoryByUser")]
        public ActionResult<IEnumerable<ClinicalHistory>> GetByUserId(string id)
        {
            try
            {
                if (!hasAccess("ClinicalHistory", "Get"))
                {
                    return Unauthorized();
                }
                var clinicalHistories = _repository.GetByUserId(id);

                if (clinicalHistories == null)
                {
                    return NotFound();
                }

                return Ok(clinicalHistories);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }


        // POST: api/ClinicalHistory
        [HttpPost]
        public ActionResult<ClinicalHistory> Post([FromBody] JsonObject json)
        {
            try
            {
                if (!hasAccess("ClinicalHistory", "Post"))
                {
                    return Unauthorized();
                }
                var clinicalHistory = ClinicalHistory.FromJson(json);
                _repository.Create(clinicalHistory);
                return CreatedAtRoute("GetClinicalHistory", new { id = clinicalHistory.Id }, clinicalHistory);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }
        

        // PUT: api/ClinicalHistory/{id}
        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] JsonObject updatedClinicalHistoryjson)
        {
            try
            {
                if (!hasAccess("ClinicalHistory", "put"))
                {
                    return Unauthorized();
                }
                var existingClinicalHistory = _repository.GetById(id);
                if (existingClinicalHistory == null)
                {
                    return NotFound();
                }
                var updatedClinicalHistory = ClinicalHistory.FromJson(updatedClinicalHistoryjson);
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
        [HttpPost("{id}", Name = "")]
        public IActionResult PutAttached(string id, [FromBody] JsonObject attachedJson)
        {
            try
            {
                if (!hasAccess("ClinicalHistory", "Post"))
                {
                    return Unauthorized();
                }
                var attached = Attached.FromJson(attachedJson);
                if (attached.IsValid(_clinicalHistoryFormatRepository.GetById(attached.id))) {
                    var ch = _repository.GetById(id);
                    ch.Attachments.Add(attached);
                    _repository.Update(ch);
                    return Ok();
                }
                
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
                if (!hasAccess("ClinicalHistory", "Delete"))
                {
                    return Unauthorized();
                }
                var clinicalHistory = _repository.GetById(id);
                if (clinicalHistory == null)
                {
                    return NotFound();
                }

                _repository.Delete(clinicalHistory.Id);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        private bool hasAccess(string name, string field)
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();

            // Parsea el token y obtén la información de reclamaciones (claims)
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;
            bool enable = false;
            if (jsonToken != null)
            {
                // Obtén las reclamaciones del token
                var claims = jsonToken.Claims;

                // Encuentra la claim que contiene los roles
                var rolesClaim = claims.Where(c => c.Type == "roles").ToList();

                if (rolesClaim != null)
                {


                    // Ahora, roles contiene un array de strings con los roles del usuario
                    foreach (var role in rolesClaim)
                    {
                        var rol = _RoleRepository.GetById(role.Value);
                        if (rol != null && rol.IsFieldEnabled(name, field))
                        {
                            return true;
                        }
                        Console.WriteLine($"Rol: {role.Value}");
                    }

                }

            }
            return false;
        }
    }
}
