using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace PruebaMongo.Controllers
{
    public class TicketsController : Controller
    {
        private readonly IMongoCollection<Ticket> _ticketsCollection;

        public TicketsController()
        {
            var connectionString = "mongodb://adminEMT:passwordEMT@localhost:27017/";
            var databaseName = "Tickets";
            var client = new MongoClient(connectionString);
            var database = client.GetDatabase(databaseName);
            _ticketsCollection = database.GetCollection<Ticket>("tickets");
        }

        [HttpGet]
        public IEnumerable<Ticket> Get()
        {
            var tickets = _ticketsCollection.Find(ticket => true).ToList();
            return tickets;
        }
    }
}
