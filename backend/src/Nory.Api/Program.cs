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

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 1024 * 1024 * 1024;
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDatabaseConfiguration(connectionString);
builder.Services.AddIdentityConfiguration();
builder.Services.AddAuthorization();

builder.Services.AddHangfireWithPostgres(connectionString);

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

builder.Services.AddValidatorsFromAssemblyContaining<IEventService>();

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

builder.Services.Configure<FileStorageOptions>(
    builder.Configuration.GetSection(FileStorageOptions.SectionName));
builder.Services.AddSingleton<IFileStorageService, LocalFileStorageService>();

builder.Services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
builder.Services.AddScoped<IAppTypeRepository, AppTypeRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IEventAppRepository, EventAppRepository>();
builder.Services.AddScoped<IEventPhotoRepository, EventPhotoRepository>();
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IThemeRepository, ThemeRepository>();

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "Nory_";
});

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

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new() { Title = "Nory API", Version = "v1" });

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

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
    await DatabaseSeeder.SeedRequiredDataAsync(app.Services);
    await DatabaseSeeder.SeedDevelopmentDataAsync(app.Services);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseHttpsRedirection();
}

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseHangfireDashboard("/hangfire");
}
else
{
    app.UseHangfireDashboard(
        "/hangfire",
        new DashboardOptions { Authorization = new[] { new HangfireAuthorizationFilter() } }
    );
}

app.MapControllers();

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
