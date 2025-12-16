using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Nory.Infrastructure.Identity;
using Nory.Infrastructure.Persistence.Extensions;
using Nory.Infrastructure.Persistence.SeedData;

namespace Nory.Infrastructure.Persistence;

public static class DatabaseSeeder
{
    public static async Task SeedDevelopmentDataAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();

        await SeedAdminUserAsync(userManager, logger);
    }

    public static async Task SeedRequiredDataAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();

        await SeedAppTypesAsync(context, logger);
        await SeedDefaultThemesAsync(context, logger);
    }

    private static async Task SeedAdminUserAsync(
        UserManager<ApplicationUser> userManager,
        ILogger logger)
    {
        var adminEmail = "admin@nory.dev";
        var existingUser = await userManager.FindByEmailAsync(adminEmail);

        if (existingUser == null)
        {
            var adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                Name = "Admin User",
                CreatedAt = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(adminUser, "Admin123!");

            if (result.Succeeded)
            {
                logger.LogInformation("Development admin user created: {Email} / Admin123!", adminEmail);
            }
            else
            {
                logger.LogError("Failed to create admin user: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
        else
        {
            logger.LogInformation("Development admin user already exists: {Email}", adminEmail);
        }
    }

    private static async Task SeedAppTypesAsync(
        ApplicationDbContext context,
        ILogger logger)
    {
        var existingAppTypes = await context.AppTypes.ToListAsync();
        var defaultAppTypes = DefaultAppTypes.GetAll();

        foreach (var appType in defaultAppTypes)
        {
            var existing = existingAppTypes.FirstOrDefault(a => a.Id == appType.Id);

            if (existing == null)
            {
                var dbModel = appType.MapToDbModel();
                context.AppTypes.Add(dbModel);
                logger.LogInformation("Seeding new app type: {AppTypeId}", appType.Id);
            }
            else
            {
                existing.Name = appType.Name;
                existing.Description = appType.Description;
                existing.Component = appType.Component;
                existing.Icon = appType.Icon;
                existing.Color = appType.Color;
                existing.IsActive = appType.IsActive;
                existing.UpdatedAt = DateTime.UtcNow;
            }
        }

        await context.SaveChangesAsync();
        logger.LogInformation("App type seeding completed. Total: {Count}", defaultAppTypes.Count);
    }

    private static async Task SeedDefaultThemesAsync(
        ApplicationDbContext context,
        ILogger logger)
    {
        var existingThemes = await context.Themes.ToListAsync();
        var defaultThemes = DefaultThemes.GetAll();

        foreach (var theme in defaultThemes)
        {
            var existingTheme = existingThemes.FirstOrDefault(t => t.Name == theme.Name);

            if (existingTheme == null)
            {
                var dbModel = theme.MapToDbModel();
                context.Themes.Add(dbModel);
                logger.LogInformation("Seeding new theme: {ThemeName}", theme.Name);
            }
            else
            {
                existingTheme.DisplayName = theme.DisplayName;
                existingTheme.Description = theme.Description;
                existingTheme.PrimaryColor = theme.PrimaryColor;
                existingTheme.SecondaryColor = theme.SecondaryColor;
                existingTheme.AccentColor = theme.AccentColor;
                existingTheme.BackgroundColor1 = theme.BackgroundColor1;
                existingTheme.BackgroundColor2 = theme.BackgroundColor2;
                existingTheme.BackgroundColor3 = theme.BackgroundColor3;
                existingTheme.TextPrimary = theme.TextPrimary;
                existingTheme.TextSecondary = theme.TextSecondary;
                existingTheme.TextAccent = theme.TextAccent;
                existingTheme.PrimaryFont = theme.PrimaryFont;
                existingTheme.SecondaryFont = theme.SecondaryFont;
                existingTheme.DarkBackgroundGradient = theme.DarkBackgroundGradient;
                existingTheme.DarkParticleColors = theme.DarkParticleColors;
                existingTheme.ThemeConfig = theme.ThemeConfig;
                existingTheme.SortOrder = theme.SortOrder;
                existingTheme.UpdatedAt = DateTime.UtcNow;

                logger.LogInformation("Updating existing theme: {ThemeName}", existingTheme.Name);
            }
        }

        await context.SaveChangesAsync();
        logger.LogInformation("Theme seeding completed. Total themes: {Count}", defaultThemes.Count);
    }
}
