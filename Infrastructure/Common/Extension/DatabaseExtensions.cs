using Core.Entities.Identity;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
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

        public static async Task DatabaseAutoMigration(this WebApplication app)
        {
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;

                var context = services.GetRequiredService<StoreContext>();
                await context.Database.MigrateAsync();

                var userManager = services.GetRequiredService<UserManager<AppUser>>();
                var identityContext = services.GetRequiredService<AppIdentityDbContext>();
                await identityContext.Database.MigrateAsync();
                await AppIdentityDbContextSeed.SeedUserAsync(userManager);
            }
        }
    }
}
