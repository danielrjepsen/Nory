namespace Nory.Application.DTOs.Setup;

public class CompleteSetupRequest
{
    public SiteSettingsDto SiteSettings { get; set; } = new();
    public AdminAccountDto AdminAccount { get; set; } = new();
    public StorageSettingsDto StorageSettings { get; set; } = new();
}

public class SiteSettingsDto
{
    public string SiteName { get; set; } = string.Empty;
    public string SiteUrl { get; set; } = string.Empty;
}

public class AdminAccountDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class StorageSettingsDto
{
    public string Type { get; set; } = "local"; // "local" or "s3"
    public string? LocalPath { get; set; }
    public string? S3Bucket { get; set; }
    public string? S3Region { get; set; }
    public string? S3AccessKey { get; set; }
    public string? S3SecretKey { get; set; }
}
