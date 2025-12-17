using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Nory.Application.Services;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Persistence.Repositories;
using Nory.Infrastructure.Services;

namespace Nory.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ISetupService, SetupService>();
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<IEventAppService, EventAppService>();
        services.AddScoped<IAttendeeService, AttendeeService>();
        services.AddScoped<IMetricsService, MetricsService>();
        services.AddScoped<IActivityLogService, ActivityLogService>();
        services.AddScoped<IThemeService, ThemeService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IPhotoService, PhotoService>();
        services.AddScoped<IPublicEventService, PublicEventService>();

        return services;
    }

    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
        services.AddScoped<IAppTypeRepository, AppTypeRepository>();
        services.AddScoped<IAttendeeRepository, AttendeeRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<IEventAppRepository, EventAppRepository>();
        services.AddScoped<IEventPhotoRepository, EventPhotoRepository>();
        services.AddScoped<IEventRepository, EventRepository>();
        services.AddScoped<IThemeRepository, ThemeRepository>();

        return services;
    }

    public static IServiceCollection AddFileStorage(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.Configure<FileStorageOptions>(
            configuration.GetSection(FileStorageOptions.SectionName));
        services.AddSingleton<IFileStorageService, LocalFileStorageService>();

        return services;
    }

    public static IServiceCollection AddValidators(this IServiceCollection services)
    {
        services.AddValidatorsFromAssemblyContaining<IEventService>();
        return services;
    }
}
