using Microsoft.AspNetCore.Mvc;
using EMT.Services.Interface.Info;
using System;
using System.Collections.Generic;
using EMT.Models.Implements;
using MongoDB.Bson;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;

namespace EMT.Controllers.Info
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _repository;
        private readonly IRoleRepository _RoleRepository;
        public UserController(IUserRepository repository, IRoleRepository roleRepository)
        {
            _repository = repository;
            _RoleRepository = roleRepository;
        }

        // GET: api/User
        [HttpGet]
        public ActionResult<IEnumerable<User>> Get()
        {
            try
            {
                if (!hasAccess("User", "Get"))
                {
                    return Unauthorized();
                }
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
                if (!hasAccess("User", "Get"))
                {
                    return Unauthorized();
                }
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
                if (!hasAccess("User", "Post"))
                {
                    return Unauthorized();
                }
                var user = User.FromJson(userJson);
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
                if (!hasAccess("User", "Put"))
                {
                    return Unauthorized();
                }
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
                if (!hasAccess("User", "Dalete"))
                {
                    return Unauthorized();
                }
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
