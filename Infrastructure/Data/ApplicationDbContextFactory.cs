using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ApplicationDbContextFactory: Core.Interfaces.IDbContextFactory<StoreContext>
    {
        private readonly DbContextOptions<StoreContext> _options;

        public ApplicationDbContextFactory(DbContextOptions<StoreContext> options)
        {
            _options = options;
        }
        public StoreContext CreateDbContext()
        {
            return new StoreContext(_options);

        }
    }
}
