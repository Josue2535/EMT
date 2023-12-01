using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace PruebaMongo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly IMongoCollection<Ticket> _ticketsCollection;

        public WeatherForecastController()
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
            var tickets = _ticketsCollection.Find(ticket => true).Limit(75000).ToList();
            return tickets;
        }

    }
}