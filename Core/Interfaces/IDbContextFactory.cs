using Microsoft.EntityFrameworkCore;

namespace Core.Interfaces
{
    public interface IDbContextFactory<T> where T : DbContext
    {
        T CreateDbContext();
    }

}
