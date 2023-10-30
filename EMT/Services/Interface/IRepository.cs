using MongoDB.Bson;

namespace EMT.Services.Interface
{
    public interface IRepository<T>
    {
        T GetById(ObjectId id);
        IEnumerable<T> GetAll();
        void Create(T entity);
        void Update(T entity);
        void Delete(ObjectId id);
    }
}
