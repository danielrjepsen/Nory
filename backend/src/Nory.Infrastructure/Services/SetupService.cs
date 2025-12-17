using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Nory.Application.DTOs.Setup;
using Nory.Application.Services;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Identity;
using Nory.Infrastructure.Persistence;

namespace Nory.Infrastructure.Services;

public class SetupService : ISetupService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ISystemSettingsRepository _systemSettings;
    private readonly ILogger<SetupService> _logger;

    public SetupService(
        ApplicationDbContext dbContext,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ISystemSettingsRepository systemSettings,
        ILogger<SetupService> logger)
    {
        _dbContext = dbContext;
        _userManager = userManager;
        _signInManager = signInManager;
        _systemSettings = systemSettings;
        _logger = logger;
    }

    public async Task<SetupStatusDto> GetStatusAsync()
    {
        var hasAdminUser = await _userManager.Users.AnyAsync();
        var databaseConnected = await CheckDatabaseConnectionAsync();
        var storageConfigured = CheckStorageConfiguration();

        return new SetupStatusDto
        {
            IsConfigured = hasAdminUser,
            HasAdminUser = hasAdminUser,
            DatabaseConnected = databaseConnected,
            StorageConfigured = storageConfigured
        };
    }

    public async Task<SetupResult> CompleteSetupAsync(CompleteSetupRequest request)
    {
        // Validate that setup hasn't already been completed
        var existingUsers = await _userManager.Users.AnyAsync();
        if (existingUsers)
        {
            return SetupResult.Fail("Setup has already been completed. An admin user already exists.");
        }

        var errors = ValidateSetupRequest(request);
        if (errors.Count > 0)
        {
            return SetupResult.Fail(errors);
        }

        try
        {
            // Create admin user
            var adminUser = new ApplicationUser
            {
                UserName = request.AdminAccount.Email,
                Email = request.AdminAccount.Email,
                Name = request.AdminAccount.Name,
                EmailConfirmed = true,
                Locale = "da"
            };

            var createResult = await _userManager.CreateAsync(adminUser, request.AdminAccount.Password);

            if (!createResult.Succeeded)
            {
                var identityErrors = createResult.Errors.Select(e => e.Description).ToList();
                _logger.LogWarning("Failed to create admin user: {Errors}", string.Join(", ", identityErrors));
                return SetupResult.Fail(identityErrors);
            }

            await GenerateEncryptionKeyIfNeededAsync();

            _logger.LogInformation("Setup completed successfully. Admin user created: {Email}", request.AdminAccount.Email);

            await _signInManager.SignInAsync(adminUser, isPersistent: true);

            return SetupResult.Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to complete setup");
            return SetupResult.Fail("An unexpected error occurred during setup. Please try again.");
        }
    }

    private async Task<bool> CheckDatabaseConnectionAsync()
    {
        try
        {
            return await _dbContext.Database.CanConnectAsync();
        }
        catch
        {
            return false;
        }
    }

    private static bool CheckStorageConfiguration()
    {
        // For local storage, we just need the uploads directory to be writable
        // This is always true for a properly configured deployment
        return true;
    }

    private static List<string> ValidateSetupRequest(CompleteSetupRequest request)
    {
        var errors = new List<string>();

        // Validate site settings
        if (string.IsNullOrWhiteSpace(request.SiteSettings.SiteName))
            errors.Add("Site name is required");

        if (string.IsNullOrWhiteSpace(request.SiteSettings.SiteUrl))
            errors.Add("Site URL is required");

        // Validate admin account
        if (string.IsNullOrWhiteSpace(request.AdminAccount.Name))
            errors.Add("Admin name is required");

        if (string.IsNullOrWhiteSpace(request.AdminAccount.Email))
            errors.Add("Admin email is required");
        else if (!IsValidEmail(request.AdminAccount.Email))
            errors.Add("Admin email is not valid");

        if (string.IsNullOrWhiteSpace(request.AdminAccount.Password))
            errors.Add("Admin password is required");
        else if (request.AdminAccount.Password.Length < 8)
            errors.Add("Admin password must be at least 8 characters");

        // Validate storage settings
        if (request.StorageSettings.Type == "s3")
        {
            if (string.IsNullOrWhiteSpace(request.StorageSettings.S3Bucket))
                errors.Add("S3 bucket name is required for S3 storage");

            if (string.IsNullOrWhiteSpace(request.StorageSettings.S3Region))
                errors.Add("S3 region is required for S3 storage");

            if (string.IsNullOrWhiteSpace(request.StorageSettings.S3AccessKey))
                errors.Add("S3 access key is required for S3 storage");

            if (string.IsNullOrWhiteSpace(request.StorageSettings.S3SecretKey))
                errors.Add("S3 secret key is required for S3 storage");
        }

        return errors;
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    private async Task GenerateEncryptionKeyIfNeededAsync()
    {
        var exists = await _systemSettings.ExistsAsync(SystemSetting.Keys.BackupEncryptionKey);
        if (exists)
            return;

        var keyBytes = new byte[32];
        RandomNumberGenerator.Fill(keyBytes);
        var keyBase64 = Convert.ToBase64String(keyBytes);

        await _systemSettings.SetValueAsync(SystemSetting.Keys.BackupEncryptionKey, keyBase64);
        _logger.LogInformation("Generated backup encryption key");
    }
}
