using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUserAsync(UserManager<AppUser> userManger)
        {
            if (!userManger.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Bob",
                    Email = "bob@test.com",
                    UserName = "bob@test.com",
                    Address = new Address
                    {
                        FirstName = "Bob",
                        LastName = "Bobbi",
                        Street = "10 The Street",
                        City = "New York",
                        State = "NY",
                        ZipCode = "98850"
                    }
                };

                await userManger.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}
