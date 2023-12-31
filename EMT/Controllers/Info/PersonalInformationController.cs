﻿using Microsoft.AspNetCore.Mvc;
using EMT.Services.Interface.Info;
using System;
using System.Collections.Generic;
using EMT.Models.Implements;
using MongoDB.Bson;
using System.Text.Json.Nodes;
using EMT.Services.Implements.Formats;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using EMT.Services.Interface.Formats;
using Microsoft.IdentityModel.Tokens;

namespace EMT.Controllers.Info
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PersonalInformationController : ControllerBase
    {
        private readonly IPersonalInformationRepository _repository;
        private readonly IRoleRepository _RoleRepository;
        private readonly IPersonalInformationFormatRepository _format;
        public PersonalInformationController(IPersonalInformationRepository repository, IRoleRepository roleRepository, IPersonalInformationFormatRepository format)
        {
            _repository = repository;
            _RoleRepository = roleRepository;
            _format = format;
        }

        // GET: api/PersonalInformation
        [HttpGet]
        public ActionResult<IEnumerable<PersonalInformation>> Get()
        {
            try
            {
                if (!hasAccess("PersonalInformation", "get"))
                {
                    return Unauthorized();
                }
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
                if (!hasAccess("PersonalInformation", "get"))
                {
                    return Unauthorized();
                }
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
        public ActionResult<PersonalInformation> Post([FromBody] JsonObject personalInformationJson)
        {
            try
            {
                if (!hasAccess("PersonalInformation", "post"))
                {
                    return Unauthorized();
                }
                var personalInformation = PersonalInformation.FromJson(personalInformationJson);
                if (personalInformation.IsValid(_format.GetFirst()) && !personalInformation.FieldList.IsNullOrEmpty()
                    )
                {
                    _repository.Create(personalInformation);
                    return CreatedAtRoute("GetPersonalInformation", new { id = personalInformation.Id }, personalInformation);
                }
                
                return BadRequest("JSON INVALIDO");
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // PUT: api/PersonalInformation/{id}
        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] JsonObject updatedPersonalInformationJson)
        {
            try
            {
                if (!hasAccess("PersonalInformation", "put"))
                {
                    return Unauthorized();
                }
                var existingPersonalInformation = _repository.GetById(id);
                if (existingPersonalInformation == null)
                {
                    return NotFound();
                }
                var updatedPersonalInformation = PersonalInformation.FromJson(updatedPersonalInformationJson);
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
                if (!hasAccess("PersonalInformation", "delete"))
                {
                    return Unauthorized();
                }
                var personalInformation = _repository.GetById(id);
                if (personalInformation == null)
                {
                    return NotFound();
                }

                _repository.Delete(personalInformation.Id);
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
    }
}
