using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContextPool<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    var dataSourceBuilder = new Npgsql.NpgsqlDataSourceBuilder(connectionString);
    dataSourceBuilder.EnableDynamicJson();
    
    // performance
    dataSourceBuilder.ConnectionStringBuilder.MinPoolSize = 5;
    dataSourceBuilder.ConnectionStringBuilder.MaxPoolSize = 20;
    dataSourceBuilder.ConnectionStringBuilder.ConnectionIdleLifetime = 300; // 5 minutes
    dataSourceBuilder.ConnectionStringBuilder.ConnectionPruningInterval = 10; // 10 seconds
    
    var dataSource = dataSourceBuilder.Build();
    
    options.UseNpgsql(dataSource,
        npgsqlOptions => {
            npgsqlOptions.EnableRetryOnFailure();
            npgsqlOptions.CommandTimeout(30); 
        });
    
    options.EnableSensitiveDataLogging(false);
    options.EnableServiceProviderCaching();
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking); 
}, poolSize: 50); // pool size for Dbcontext
