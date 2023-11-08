﻿using Microsoft.AspNetCore.Mvc;
using EMT.Services.Interface.Info;
using System;
using System.Collections.Generic;
using EMT.Models.Implements;
using MongoDB.Bson;
using System.Text.Json.Nodes;

namespace EMT.Controllers.Info
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleRepository _repository;

        public RoleController(IRoleRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Role
        [HttpGet]
        public ActionResult<IEnumerable<Role>> Get()
        {
            try
            {
                var roles = _repository.GetAll();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET: api/Role/{id}
        [HttpGet("{id}", Name = "GetRole")]
        public ActionResult<Role> Get(string id)
        {
            try
            {
                var role = _repository.GetById(id);
                if (role == null)
                {
                    return NotFound();
                }
                return Ok(role);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // POST: api/Role
        [HttpPost]
        public ActionResult<Role> Post([FromBody] JsonObject role)
        {
            try
            {
                var rol = Role.FromJson(role);
                _repository.Create(rol);
                return CreatedAtRoute("GetRole", new { id = rol.Id }, role);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // PUT: api/Role/{id}
        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] JsonObject updatedRoleJson)
        {
            try
            {
                var existingRole = _repository.GetById(id);
                if (existingRole == null)
                {
                    return NotFound();
                }
                var updatedRole = Role.FromJson(updatedRoleJson);
                updatedRole.Id = existingRole.Id;
                _repository.Update(updatedRole);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // DELETE: api/Role/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            try
            {
                var role = _repository.GetById(id);
                if (role == null)
                {
                    return NotFound();
                }

                _repository.Delete(role.Id);
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