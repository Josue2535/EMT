using EMT.Models.Formats;
using EMT.Services;
using EMT.Services.Implements.Formats;
using EMT.Services.Implements.Info;
using EMT.Services.Interface.Formats;
using EMT.Services.Interface.Info;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

var config = builder.Configuration;

// Add services to the container.
builder.Services.AddControllers(); // Agrega los servicios de los controladores

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<DataBaseSettings>(
    builder.Configuration.GetSection("Database"));

builder.Services.AddAuthorization();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
    o.RequireHttpsMetadata = false;
    o.Authority = config.GetValue<string>("Jwt:Authority");
    o.Audience = config.GetValue<string>("Jwt:Audience");
});
// Configura la conexión a MongoDB
builder.Services.AddSingleton<IMongoClient>(provider =>
{
    var connectionString = config.GetConnectionString("MongoDBConnection");
    return new MongoClient(connectionString);
});

builder.Services.AddScoped<IMongoDatabase>(provider =>
{
    var client = provider.GetRequiredService<IMongoClient>();
    var databaseName = config.GetConnectionString("MongoDBDatabaseName");
    return client.GetDatabase(databaseName);
});
builder.Services.AddScoped<IClinicalHistoryFormatRepository, ClinicalHistoryFormatRepository>();
builder.Services.AddScoped<IPacientRepository, PacientRepository>();


builder.Services.AddCors(opts =>
{
    opts.AddPolicy(name: "any", builder =>
        builder.AllowAnyMethod().AllowAnyOrigin().AllowAnyHeader());
});

var app = builder.Build();
app.UseCors("any");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

// Mapea los controladores
app.MapControllers();



app.Run();
