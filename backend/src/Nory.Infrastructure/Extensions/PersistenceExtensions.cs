using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Nory.Infrastructure.Persistence;

namespace Nory.Infrastructure.Extensions;

public static class PersistenceExtensions
{
    public static IServiceCollection AddDatabaseConfiguration(
        this IServiceCollection services,
        string connectionString
    )
    {
        services.AddDbContextPool<ApplicationDbContext>(
            options =>
            {
                var dataSourceBuilder = new Npgsql.NpgsqlDataSourceBuilder(connectionString);
                dataSourceBuilder.EnableDynamicJson();

                // Performance settings
                dataSourceBuilder.ConnectionStringBuilder.MinPoolSize = 5;
                dataSourceBuilder.ConnectionStringBuilder.MaxPoolSize = 20;
                dataSourceBuilder.ConnectionStringBuilder.ConnectionIdleLifetime = 300; // 5 minutes
                dataSourceBuilder.ConnectionStringBuilder.ConnectionPruningInterval = 10; // 10 seconds

                var dataSource = dataSourceBuilder.Build();

                options.UseNpgsql(
                    dataSource,
                    npgsqlOptions =>
                    {
                        npgsqlOptions.EnableRetryOnFailure();
                        npgsqlOptions.CommandTimeout(30);
                    }
                );

                options.EnableSensitiveDataLogging(false);
                options.EnableServiceProviderCaching();
                options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            },
            poolSize: 50
        );

        return services;
    }
}
