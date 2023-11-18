using API.Errors;
using API.Extension;
using API.Helpers;
using API.Middleware;
using Core.Interfaces;
using Infrastructure.Common.Extension;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle


builder.Services.AddDbContext<StoreContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddApplicationServices();
builder.Services.AddSwaggerDocumentation();

builder.Services.AddCors(opts =>
{
    opts.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
    });
});


var app = builder.Build();
app.DatabaseAutoMigration();

app.UseMiddleware<ExceptionMiddleware>();
// Configure the HTTP request pipeline.
app.AddSwaggerDocumentation();

app.UseStatusCodePagesWithReExecute("/errors/{0}");

app.UseHttpsRedirection();
app.UseRouting();
app.UseStaticFiles();

app.UseCors("CorsPolicy");

app.UseAuthorization();


app.MapControllers();

app.Run();
