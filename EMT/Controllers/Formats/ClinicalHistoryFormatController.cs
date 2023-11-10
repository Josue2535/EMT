﻿using EMT.Models.Formats;
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
            if (hasAccess("ClinicHistoryFormat", "Get"))
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
            if (hasAccess("ClinicHistoryFormat", "Get"))
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

        [HttpPost(Name = "CreateClinicalHistoryFormat")]
        public IActionResult Post([FromBody] JsonObject json)
        {
            try
            {
                if (hasAccess("ClinicHistoryFormat", "post"))
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
            if (hasAccess("ClinicHistoryFormat", "put"))
            {
                // Implementa la lógica para actualizar un formato existente
                var existingFormat = _clinicalHistoryFormatRepository.GetById(id);

                if (existingFormat == null)
                {
                    return NotFound();
                }

                // Actualiza las propiedades necesarias
                existingFormat = ClinicalHistoryFormat.GetFromJson(json);

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

        public bool hasAccess(string name, string field)
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
        public List<string> GetFormats()
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
                var rolesClaim = claims.Where(c => c.Type == "roles").ToList();

                if (rolesClaim != null)
                {
                    // Inicializa una lista para almacenar los valores únicos
                    List<string> uniqueValues = new List<string>();

                    // Ahora, roles contiene un array de strings con los roles del usuario
                    foreach (var role in rolesClaim)
                    {
                        var rol = _RoleRepository.GetById(role.Value);


                        // Agrega los valores únicos de ValidFields al resultado
                        uniqueValues.AddRange(rol.formats());


                        Console.WriteLine($"Rol: {role.Value}");
                    }

                    // Devuelve la lista de valores únicos sin duplicados
                    return uniqueValues.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
                }

            }

            // Si no hay roles o el token no es válido, devuelve una lista vacía
            return new List<string>();
        }


    }

}
