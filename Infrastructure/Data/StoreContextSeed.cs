using Core.Entities;
using Core.Entities.OrderAggregate;
using Infrastructure.Common.Extension;
using System.Reflection;
using System.Text.Json;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context)
        {
            var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);


            if (!context.ProductBrands.Any())
            {
                string filePath = EnvironmentChecker.IsProduction() ? @$"{path}/Data/SeedData/brands.json" : @"../Infrastructure/Data/SeedData/brands.json";
                var brandsData = File.ReadAllText(filePath);
                var brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);
                context.ProductBrands.AddRange(brands);
            }

            if (!context.ProductTypes.Any())
            {
                string filePath = EnvironmentChecker.IsProduction() ? @$"{path}/Data/SeedData/types.json" : @"../Infrastructure/Data/SeedData/types.json";
                var typesData = File.ReadAllText(filePath);
                var types = JsonSerializer.Deserialize<List<ProductType>>(typesData);
                context.ProductTypes.AddRange(types);
            }
            if (!context.DeliveryMethods.Any())
            {
                string filePath = EnvironmentChecker.IsProduction() ? @$"{path}/Data/SeedData/delivery.json" : @"../Infrastructure/Data/SeedData/delivery.json";
                var deliveryData = File.ReadAllText(filePath);
                var methods = JsonSerializer.Deserialize<List<DeliveryMethod>>(deliveryData);
                context.DeliveryMethods.AddRange(methods);
            }
            if (!context.Products.Any())
            {
                string filePath = EnvironmentChecker.IsProduction() ? @$"{path}/Data/SeedData/products.json" : @"../Infrastructure/Data/SeedData/products.json";
                var productsData = File.ReadAllText(filePath);
                var products = JsonSerializer.Deserialize<List<Product>>(productsData);
                context.Products.AddRange(products);
            }

            if (context.ChangeTracker.HasChanges()) await context.SaveChangesAsync();
        }
    }
}
