using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class AuthorizationServiceExtensions
    {
         public static IServiceCollection AddAuthorizationServices(this IServiceCollection services, IConfiguration config)
        {       
                services.AddAuthorization(options =>
                {
                    options.AddPolicy("AdminOnly", policy => policy.RequireClaim("Role", "Admin"));
                });

            return services;
        }
    }
}