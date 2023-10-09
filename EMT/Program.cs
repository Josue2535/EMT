using EMT.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
