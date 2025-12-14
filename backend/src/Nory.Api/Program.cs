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

// Configure Kestrel for large file uploads (1GB max for videos)
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 1024 * 1024 * 1024; // 1GB
});

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
builder.Services.AddScoped<IEventAppService, Nory.Infrastructure.Services.EventAppService>();
builder.Services.AddScoped<IAttendeeService, Nory.Infrastructure.Services.AttendeeService>();
builder.Services.AddScoped<IMetricsService, MetricsService>();
builder.Services.AddScoped<IActivityLogService, ActivityLogService>();
builder.Services.AddScoped<IThemeService, Nory.Infrastructure.Services.ThemeService>();
builder.Services.AddScoped<ICategoryService, Nory.Infrastructure.Services.CategoryService>();
builder.Services.AddScoped<IPhotoService, Nory.Infrastructure.Services.PhotoService>();
builder.Services.AddScoped<IPublicEventService, Nory.Infrastructure.Services.PublicEventService>();

// Register File Storage Service
builder.Services.Configure<FileStorageOptions>(
    builder.Configuration.GetSection(FileStorageOptions.SectionName));
builder.Services.AddSingleton<IFileStorageService, LocalFileStorageService>();

// Register Repositories
builder.Services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IThemeRepository, ThemeRepository>();

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

    // Seed required data (themes, etc.)
    await DatabaseSeeder.SeedRequiredDataAsync(app.Services);

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
