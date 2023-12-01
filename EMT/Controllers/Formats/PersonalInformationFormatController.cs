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
using EMT.Services.Interface.Info;
using System.IdentityModel.Tokens.Jwt;

namespace EMT.Controllers.Formats
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonalInformationFormatController : ControllerBase
    {
        private readonly IPersonalInformationFormatRepository _repository;
        private readonly IRoleRepository _RoleRepository;
        public PersonalInformationFormatController(IPersonalInformationFormatRepository repository, IRoleRepository roleRepository)
        {
            _repository = repository;
            _RoleRepository = roleRepository;
        }

        // GET: api/PersonalInformationFormat
        [HttpGet]
        public ActionResult<IEnumerable<PersonalInformationFormat>> Get()
        {
            try
            {
                if (!hasAccess("PersonalInformationFormat", "get"))
                {
                    return Unauthorized();
                }
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
                if (!hasAccess("PersonalInformationFormat", "get"))
                {
                    return Unauthorized();
                }
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
        public ActionResult<PersonalInformationFormat> Post([FromBody] JsonObject format)
        {
            try
            {
                if (!hasAccess("PersonalInformationFormat", "post"))
                {
                    return Unauthorized();
                }
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
            if (!hasAccess("PersonalInformationFormat", "put"))
            {
                return Unauthorized();
            }
            // Implementa la lógica para actualizar un formato existente
            var existingFormat = _repository.GetById(id);

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
                if (!hasAccess("PersonalInformationFormat", "delete"))
                {
                    return Unauthorized();
                }
                var format = _repository.GetById(id);
                if (format == null)
                {
                    return NotFound();
                }

                _repository.Delete(format.Id);
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
                        var rol = _RoleRepository.GetByName(role.Value);
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
