using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Nory.Infrastructure.Hangfire;

namespace Nory.Infrastructure.Extensions;

public static class HangfireExtensions
{
    public static IServiceCollection AddHangfireWithPostgres(
        this IServiceCollection services,
        string connectionString
    )
    {
        services.AddHangfire(configuration =>
            configuration
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UsePostgreSqlStorage(options =>
                {
                    options.UseNpgsqlConnection(connectionString);
                })
        );

        services.AddHangfireServer();

        return services;
    }

    public static WebApplication UseHangfireDashboardWithAuth(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseHangfireDashboard("/hangfire"); // Open access in dev
        }
        else
        {
            app.UseHangfireDashboard(
                "/hangfire",
                new DashboardOptions { Authorization = new[] { new HangfireAuthorizationFilter() } }
            );
        }

        return app;
    }
}
