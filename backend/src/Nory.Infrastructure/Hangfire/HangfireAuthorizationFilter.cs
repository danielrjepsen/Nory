// Infrastructure/Hangfire/HangfireAuthorizationFilter.cs
using Hangfire.Dashboard;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Nory.Infrastructure.Hangfire;

public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var httpContext = context.GetHttpContext();

        // Allow access in development
        var env = httpContext.RequestServices.GetRequiredService<IHostEnvironment>();
        if (env.IsDevelopment())
        {
            return true;
        }

        // In production, require authentication
        return httpContext.User.Identity?.IsAuthenticated ?? false;
    }
}
