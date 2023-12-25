using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using System.Collections;
using System.Text;
using API.Helpers;

namespace API.Extension
{
    public static class ApplicationServicesExtension
    {
        // public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        // {
        //     services.AddEndpointsApiExplorer();
        //     services.AddSingleton<SymmetricSecurityKey>(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])));
        //     services.AddSingleton<Hashtable>();
        //     services.AddTransient<ITokenService, TokenService>();
        //  
        //
        //
        //     services.AddScoped<IProductRepository, ProductRepository>();
        //     services.AddScoped<IBasketRepository, BasketRepository>();
        //     services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        //     services.AddScoped<StoreContext>();
        //     // Register the factory
        //     services.AddScoped<IDbContextFactory<StoreContext>, ApplicationDbContextFactory>();
        //     services.AddScoped<IOrderService, OrderService>();
        //     services.AddScoped<IUnitOfWork, UnitOfWork>();
        //     services.AddAutoMapper(typeof(MappingProfiles));
        //
        //     services.Configure<ApiBehaviorOptions>(options =>
        //     {
        //         options.InvalidModelStateResponseFactory = actionContext =>
        //         {
        //             var errors = actionContext.ModelState
        //             .Where(e => e.Value.Errors.Count > 0)
        //             .SelectMany(x => x.Value.Errors)
        //             .Select(x => x.ErrorMessage).ToArray();
        //
        //             var errorResponse = new ApiValidationErrorResponse
        //             {
        //                 Errors = errors
        //             };
        //             return new BadRequestObjectResult(errorResponse);
        //         };
        //     });
        //     return services;
        // }



        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
          IConfiguration config)
        {
            //services.AddSingleton<IResponseCacheService, ResponseCacheService>();
            services.AddDbContext<StoreContext>(opt =>
            {
                opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });
            services.AddTransient<StoreContext>();
            services.AddSingleton<IConnectionMultiplexer>(c =>
            {
                var options = ConfigurationOptions.Parse(config.GetConnectionString("Redis"));
                return ConnectionMultiplexer.Connect(options);
            });
            services.AddScoped<IBasketRepository, BasketRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            //services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddTransient<IUnitOfWork, UnitOfWork>();
            services.AddTransient(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddAutoMapper(typeof(MappingProfiles));
            services.AddSingleton<SymmetricSecurityKey>(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Token:Key"])));
            services.AddSingleton<Hashtable>();
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    var errors = actionContext.ModelState
                        .Where(e => e.Value.Errors.Count > 0)
                        .SelectMany(x => x.Value.Errors)
                        .Select(x => x.ErrorMessage).ToArray();

                    var errorResponse = new ApiValidationErrorResponse
                    {
                        Errors = errors
                    };

                    return new BadRequestObjectResult(errorResponse);
                };
            });

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
                });
            });

            return services;
        }
    }
}
