namespace Nory.Infrastructure.Configuration;

public class JwtSettings
{
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpirationMinutes { get; set; } = 30;
    public int RefreshTokenExpirationDays { get; set; } = 7;
    
    public void ValidateSettings()
    {
        if (string.IsNullOrEmpty(Secret) || Secret.Length < 32)
            throw new InvalidOperationException("JWT Secret must be at least 32 characters long");
        
        if (string.IsNullOrEmpty(Issuer))
            throw new InvalidOperationException("JWT Issuer is required");
            
        if (string.IsNullOrEmpty(Audience))
            throw new InvalidOperationException("JWT Audience is required");
            
        if (ExpirationMinutes < 5 || ExpirationMinutes > 120)
            throw new InvalidOperationException("JWT expiration must be between 5 and 120 minutes");
    }
}