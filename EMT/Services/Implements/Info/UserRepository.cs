﻿using EMT.Models.Implements;
using EMT.Services.Interface.Info;
using MongoDB.Driver;

namespace EMT.Services.Implements.Info
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _collection;

        public UserRepository(IMongoDatabase database)
        {
            _collection = database.GetCollection<User>("Users");
        }

        public User GetById(string id)
        {
            return _collection.Find(user => user.Id == id).FirstOrDefault();
        }

        public IEnumerable<User> GetAll()
        {
            return _collection.Find(_ => true).ToList();
        }

        public void Create(User user)
        {
            _collection.InsertOne(user);
        }

        public void Update( User user)
        {
            _collection.ReplaceOne(u => u.Id == user.Id, user);
        }

        public void Delete(string id)
        {
            _collection.DeleteOne(user => user.Id == id);
        }

        public Role GetRoleByUserId(string userId)
        {
            var user = _collection.Find(u => u.Id == userId).FirstOrDefault();

            return user?.Role;
        }
    }

}
