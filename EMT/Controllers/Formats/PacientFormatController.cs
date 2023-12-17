using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json.Nodes;
using EMT.Models.Formats;
using EMT.Services.Implements.Formats;
using EMT.Services.Interface.Formats;
using EMT.Services.Interface.Info;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;

namespace EMT.Controllers.Formats
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PacientFormatController : ControllerBase
    {
        private readonly IPacientFormatRepository _repository;
        private readonly IRoleRepository _RoleRepository;
        public PacientFormatController(IPacientFormatRepository repository, IRoleRepository roleRepositor)
        {
            _repository = repository;
            _RoleRepository = roleRepositor;
        }

        // GET: api/PacientFormat
        [HttpGet]
        public ActionResult<IEnumerable<PacientFormat>> Get()
        {
            try
            {
                if (hasAccess("PacientFormat", "get"))
                {
                    var formats = _repository.GetAll();
                    return Ok(formats);
                }
                else {
                    return Unauthorized();
                }
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
                if (hasAccess("PacientFormat", "get"))
                {
                    var format = _repository.GetById(id);
                    if (format == null)
                    {
                        return NotFound();
                    }
                    return Ok(format);
                }
                else { 
                    return Unauthorized();
                }
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
                if (hasAccess("PacientFormat", "post"))
                {
                    if (_repository.GetAll().ToList().IsNullOrEmpty())
                    {
                        var pacientFormat = PacientFormat.GetFromJson(format);
                        _repository.Create(pacientFormat);
                        return CreatedAtRoute("GetPacientFormat", new { id = pacientFormat.Id.ToString() }, format);
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status400BadRequest, "a format already exists");
                    }
                }
                else
                {
                    return Unauthorized();
                }
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
                if (hasAccess("PacientFormat", "put"))
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
                else
                {
                    return Unauthorized();
                }
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
                if (hasAccess("PacientFormat", "put"))
                {
                    var format = _repository.GetById(id);
                    if (format == null)
                    {
                        return NotFound();
                    }

                    _repository.Delete(id);
                    return NoContent();
                }
                else
                {
                    return Unauthorized();
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error");
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
                var rolesClaim = claims.Where(c => c.Type == "realm_access").ToList();

                if (rolesClaim != null)
                {


                    // Ahora, roles contiene un array de strings con los roles del usuario
                    foreach (var role in rolesClaim)
                    {
                        var array = role.Value.Replace("\"", "").Replace("roles", "").Replace("\\", "").Replace(":", "")
                            .Replace("{", "").Replace("}", "").Replace("[", "").Replace("]", "").Split(",");
                        foreach (var realmRole in array)
                        {
                            var rol = _RoleRepository.GetByName(realmRole);
                            if (rol != null && rol.IsFieldEnabled(name, field))
                            {
                                return true;
                            }
                            Console.WriteLine($"Rol: {realmRole}");
                        }
                    }

                }

            }
            return false;
        }
    }
}
