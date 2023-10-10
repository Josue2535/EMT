﻿using EMT.Models.Implements;

namespace EMT.Services.Interface.Info
{
    public interface IUserRepository : IRepository<User>
    {
        // Agrega operaciones específicas si es necesario

        // Obtiene el rol de un usuario por su id
        Role GetRoleByUserId(string userId);
    }
}