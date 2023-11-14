using Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace Infrastructure.Common.Extension
{
    public static class DatabaseExtensions
    {
        public static void ConfigureSqlContext(this IServiceCollection serviecs, IConfiguration configuration)
        {
            serviecs.AddDbContext<StoreContext>(opts =>
            {
                opts.UseSqlServer(configuration["ConnectionStrings:DefaultConnection"],
                    opt => opt.MigrationsAssembly("API"));
            });
        }

        public static void DatabaseAutoMigration(this WebApplication app)
        {
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;

                var context = services.GetRequiredService<StoreContext>();
                context.Database.Migrate();
            }
        }
    }
}
