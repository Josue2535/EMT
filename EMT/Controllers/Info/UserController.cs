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
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _repository;

        public UserController(IUserRepository repository)
        {
            _repository = repository;
        }

        // GET: api/User
        [HttpGet]
        public ActionResult<IEnumerable<User>> Get()
        {
            try
            {
                var users = _repository.GetAll();
                return Ok(users);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET: api/User/{id}
        [HttpGet("{id}", Name = "GetUser")]
        public ActionResult<User> Get(string id)
        {
            try
            {
                var user = _repository.GetById(id);
                if (user == null)
                {
                    return NotFound();
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // POST: api/User
        [HttpPost]
        public ActionResult<User> Post([FromBody] JsonObject userJson)
        {
            try
            {

                var user = EMT.Models.Implements.User.FromJson(userJson);
                _repository.Create(user);
                return CreatedAtRoute("GetUser", new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // PUT: api/User/{id}
        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] User updatedUser)
        {
            try
            {
                var existingUser = _repository.GetById(id);
                if (existingUser == null)
                {
                    return NotFound();
                }

                updatedUser.Id = existingUser.Id;
                _repository.Update(updatedUser);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        // DELETE: api/User/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            try
            {
                var user = _repository.GetById(id);
                if (user == null)
                {
                    return NotFound();
                }

                _repository.Delete(user.Id);
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