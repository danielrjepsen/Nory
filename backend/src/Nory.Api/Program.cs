using System.Text;
using System.Text.Json;
using FluentValidation;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Nory.Application.Services;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Extensions;
using Nory.Infrastructure.Hangfire;
using Nory.Infrastructure.Identity;
using Nory.Infrastructure.Jobs;
using Nory.Infrastructure.Persistence;
using Nory.Infrastructure.Persistence.Repositories;
using Nory.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Get connection string once
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDatabaseConfiguration(connectionString);
builder.Services.AddIdentityConfiguration();
builder.Services.AddAuthorization();

builder.Services.AddHangfireWithPostgres(connectionString);

// Add Controllers
builder
    .Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System
            .Text
            .Json
            .Serialization
            .JsonIgnoreCondition
            .WhenWritingNull;
    });

// Register FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<IEventService>();

// Register Application Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IMetricsService, MetricsService>();
builder.Services.AddScoped<IActivityLogService, ActivityLogService>();

// Register Repositories
builder.Services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
builder.Services.AddScoped<IEventRepository, EventRepository>();

// Add Redis Cache
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "Nory_";
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins(
                builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[]
                    {
                        "http://localhost:3000",
                        "http://localhost:3001",
                        "http://localhost:3002",
                    }
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "Nory API", Version = "v1" });

    // Add JWT Authentication to Swagger
    options.AddSecurityDefinition(
        "Bearer",
        new()
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter your JWT token",
        }
    );

    options.AddSecurityRequirement(
        new()
        {
            {
                new()
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer",
                    },
                },
                Array.Empty<string>()
            },
        }
    );
});

var app = builder.Build();

// Run database migrations on startup (best practice for self-hosted/containerized apps)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();

    // Seed default admin user (if no users exist)
    await DatabaseSeeder.SeedDevelopmentDataAsync(app.Services);
}

// Configure middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // HTTPS redirect only in development (production uses reverse proxy for SSL)
    app.UseHttpsRedirection();
}

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

// Add Hangfire Dashboard
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

app.MapControllers();

// Configure recurring jobs
using (var scope = app.Services.CreateScope())
{
    var recurringJobManager = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

    recurringJobManager.AddOrUpdate<MetricsUpdateJob>(
        "update-all-metrics",
        job => job.UpdateAllMetricsAsync(),
        Cron.MinuteInterval(5)
    );
}

app.Run();
