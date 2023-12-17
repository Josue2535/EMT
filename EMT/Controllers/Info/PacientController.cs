using Microsoft.AspNetCore.Mvc;
using EMT.Services.Interface.Info;
using System;
using System.Collections.Generic;
using EMT.Models.Implements;
using MongoDB.Bson;
using System.Text.Json.Nodes;
using EMT.Services.Implements.Formats;
using System.IdentityModel.Tokens.Jwt;
using EMT.Services.Interface.Formats;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

namespace EMT.Controllers.Info
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PacientController : ControllerBase
    {
        private readonly IPacientRepository _repository;
        private readonly IRoleRepository _RoleRepository;
        private readonly IPacientFormatRepository _PacientFormtatRepository;
        public PacientController(IPacientRepository repository, IRoleRepository roleRepository, IPacientFormatRepository PacientFormtatRepository)
        {
            _repository = repository;
            _RoleRepository = roleRepository;
            _PacientFormtatRepository = PacientFormtatRepository;
        }

        // GET: api/Pacient
        [HttpGet]
        public ActionResult<IEnumerable<Pacient>> Get()
        {
            try
            {
                if (!hasAccess("Pacient", "get")) 
                { 
                    return Unauthorized();
                }
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
                if (!hasAccess("Pacient", "get"))
                {
                    return Unauthorized();
                }
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

        [HttpGet("GetByRole")]
        public ActionResult<Pacient> GetByRole()
        {
            try
            {
                if (!hasAccess("Pacient", "get"))
                {
                    return Unauthorized();
                }
                var pacient = PacientsByRole();
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
        [HttpPost("GetByField")]
        public IActionResult GetByField([FromBody] JsonObject filter)
        {
            try
            {
                if (!hasAccess("Pacient", "get"))
                {
                    return Unauthorized();
                }
                var fieldname = filter["Name"].GetValue<string>();
                var value = filter["value"].GetValue<string>();
                var pacient = _repository.SearchByField(fieldname,value );
                if (pacient == null)
                {
                    return NotFound();
                }
                return Ok(pacient);
            }
            catch (Exception ex)
            {
                // Log the exception
                return BadRequest("Json invalido");
            }
        }

        // POST: api/Pacient
        [HttpPost]
        public ActionResult<Pacient> Post([FromBody] JsonObject pacientJson)
        {
            try
            {
                if (!hasAccess("Pacient", "post"))
                {
                    return Unauthorized();
                }
                var pacient = Pacient.FromJson(pacientJson);

                if (pacient.IsValid(_PacientFormtatRepository.GetFirst())&&!pacient.FieldsList.IsNullOrEmpty())
                {
                    _repository.Create(pacient);
                    return CreatedAtRoute("GetPacient", new { id = pacient.Id }, pacient);
                }
                return BadRequest("JSON NO VALIDO");    
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // PUT: api/Pacient/{id}
        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] JsonObject updatedPacientJson)
        {
            try
            {
                if (!hasAccess("Pacient", "put"))
                {
                    return Unauthorized();
                }
                var existingPacient = _repository.GetById(id);
                if (existingPacient == null)
                {
                    return NotFound();
                }
                var updatedPacient = Pacient.FromJson(updatedPacientJson);
                if (updatedPacient.IsValid(_PacientFormtatRepository.GetFirst()))
                {
                    updatedPacient.Id = existingPacient.Id;
                    _repository.Update(updatedPacient);
                    return NoContent();
                }
                return BadRequest("JSON NO VALIDO");
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
                if (!hasAccess("Pacient", "delete"))
                {
                    return Unauthorized();
                }
                var pacient = _repository.GetById(id);
                if (pacient == null)
                {
                    return NotFound();
                }

                _repository.Delete(pacient.Id);
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

        private List<Pacient> PacientsByRole()
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();
            var pacientsByUserRole = new List<Pacient>();
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


                    

                    // Iterar a través de los roles del usuario
                    foreach (var role in rolesClaim)
                    {
                        var rol = _RoleRepository.GetByName(role.Value);
                        if (rol != null)
                        {
                            // Obtener los pacientes asociados a este rol
                            var pacientsForRole = _repository.GetByRole(rol.Name);

                            // Agregar los pacientes a la lista general
                            pacientsByUserRole.AddRange(pacientsForRole);
                        }
                    }

                }

            }
            return pacientsByUserRole;
        }


    }
}
