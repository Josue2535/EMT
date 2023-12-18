using EMT.Models.Formats;
using EMT.Services.Interface.Formats;
using EMT.Services.Interface.Info;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using System.Text.Json.Nodes;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EMT.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class ClinicalHistoryFormatController : ControllerBase
    {
        private readonly IClinicalHistoryFormatRepository _clinicalHistoryFormatRepository;
        private readonly IRoleRepository _RoleRepository;

        public ClinicalHistoryFormatController(IClinicalHistoryFormatRepository clinicalHistoryFormatRepository, IRoleRepository RoleRepository)
        {
            _clinicalHistoryFormatRepository = clinicalHistoryFormatRepository;
            _RoleRepository = RoleRepository;
        }

        [HttpGet(Name = "GetClinicalHistoryFormats")]
        public IEnumerable<ClinicalHistoryFormat> Get()
        {
            if (hasAccess("ClinicalHistoryFormat", "get"))
            {
                // Implementa la lógica para obtener todos los formatos
                var formats = _clinicalHistoryFormatRepository.GetAll();
                return formats;
            }
            else
            {
                return null;

            }
        }
        [HttpGet("GetByRole")]
        public IEnumerable<ClinicalHistoryFormat> GetByRole()
        {
            if (hasAccess("ClinicalHistoryFormat", "get"))
            {
                // Implementa la lógica para obtener todos los formatos
                var formats = _clinicalHistoryFormatRepository.GetAll(GetFormats());
                return formats;
            }
            else
            {
                return null;

            }
        }

        [HttpGet("{id}", Name = "GetClinicalHistoryFormatById")]
        public IActionResult Get(string id)
        {
            if (hasAccess("ClinicalHistoryFormat", "get"))
            {

                // Implementa la lógica para obtener un formato por su ID
                var format = _clinicalHistoryFormatRepository.GetById(id);

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

        [HttpPost]
        public IActionResult Post([FromBody] JsonObject json)
        {
            try
            {
                if (hasAccess("ClinicalHistoryFormat", "post"))
                {
                    // Convierte manualmente el JSON a un objeto ClinicalHistoryFormat
                    var clinicalHistoryFormat = ClinicalHistoryFormat.GetFromJson(json);

                    // Implementa la lógica para crear un nuevo formato
                    _clinicalHistoryFormatRepository.Create(clinicalHistoryFormat);

                    return CreatedAtRoute("GetClinicalHistoryFormatById", new { id = clinicalHistoryFormat.Id }, clinicalHistoryFormat);
                }
                else {
                    return Unauthorized();
                }
            }
            catch (JsonException)
            {
                // Maneja errores de deserialización de JSON
                return BadRequest("Formato JSON no válido");
            }
        }


        [HttpPut("{id}", Name = "UpdateClinicalHistoryFormat")]
        public IActionResult Put(string id, [FromBody] JsonObject json)
        {
            if (hasAccess("ClinicalHistoryFormat", "put"))
            {
                // Implementa la lógica para actualizar un formato existente
                var existingFormat = _clinicalHistoryFormatRepository.GetById(id);

                if (existingFormat == null)
                {
                    return NotFound();
                }

                // Actualiza las propiedades necesarias
                existingFormat = ClinicalHistoryFormat.GetFromJson(json);
                existingFormat.Id = id;
                
                _clinicalHistoryFormatRepository.Update(existingFormat);

                return NoContent();
            }
            else {
                return Unauthorized();
            }
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

            _clinicalHistoryFormatRepository.Delete(id);

            return NoContent();
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
        private List<string> GetFormats()
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var handler = new JwtSecurityTokenHandler();

            // Parsea el token y obtén la información de reclamaciones (claims)
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            if (jsonToken != null)
            {
                // Obtén las reclamaciones del token
                var claims = jsonToken.Claims;

                // Encuentra la claim que contiene los roles
                var rolesClaim = claims.Where(c => c.Type == "realm_access").ToList();

                if (rolesClaim != null)
                {
                    // Inicializa una lista para almacenar los valores únicos
                    List<string> uniqueValues = new List<string>();
                    try
                    {
                        // Ahora, roles contiene un array de strings con los roles del usuario
                        foreach (var role in rolesClaim)
                        {
                            var array = role.Value.Replace("\"", "").Replace("roles", "").Replace("\\", "").Replace(":", "")
                           .Replace("{", "").Replace("}", "").Replace("[", "").Replace("]", "").Split(",");
                            foreach (var realmRole in array)
                            {
                                var rol = _RoleRepository.GetByName(realmRole);

                                if (rol != null)
                                {
                                    // Agrega los valores únicos de ValidFields al resultado
                                    uniqueValues.AddRange(rol.formats());


                                    Console.WriteLine($"Rol: {role.Value}");
                                }
                            }
                        }

                        // Devuelve la lista de valores únicos sin duplicados
                        return uniqueValues.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
                    }catch (Exception ex)
                    {
                        return new List<string>();  
                    }
                }

            }

            // Si no hay roles o el token no es válido, devuelve una lista vacía
            return new List<string>();
        }


    }

}
