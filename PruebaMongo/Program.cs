using MongoDB.Driver;
using PruebaMongo;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add MongoDB configuration
builder.Services.AddSingleton<IMongoClient>(new MongoClient("mongodb://adminEMT:passwordEMT@localhost:27017/"));
builder.Services.AddScoped(_ => _.GetRequiredService<IMongoClient>().StartSession());

builder.Services.AddScoped<IMongoDatabase>(_ =>
{
    var client = _.GetRequiredService<IMongoClient>();
    return client.GetDatabase("Tickets");
});

builder.Services.AddScoped(_ =>
{
    var database = _.GetRequiredService<IMongoDatabase>();
    return database.GetCollection<Ticket>("tickets");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
