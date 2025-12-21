using Nory.Core.Domain.Enums;

namespace Nory.Core.Domain.Entities;

public class EmailConfiguration
{
    public int Id { get; private set; }
    public bool IsEnabled { get; private set; }
    public EmailProvider Provider { get; private set; }
    public string SmtpHost { get; private set; } = null!;
    public int SmtpPort { get; private set; }
    public bool UseSsl { get; private set; }
    public string Username { get; private set; } = null!;
    public string EncryptedPassword { get; private set; } = null!;
    public string FromEmail { get; private set; } = null!;
    public string FromName { get; private set; } = null!;
    public DateTime? LastTestedAt { get; private set; }
    public bool? LastTestSuccessful { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private EmailConfiguration() { }

    public EmailConfiguration(
        EmailProvider provider,
        string smtpHost,
        int smtpPort,
        bool useSsl,
        string username,
        string encryptedPassword,
        string fromEmail,
        string fromName)
    {
        Provider = provider;
        SmtpHost = smtpHost;
        SmtpPort = smtpPort;
        UseSsl = useSsl;
        Username = username;
        EncryptedPassword = encryptedPassword;
        FromEmail = fromEmail;
        FromName = fromName;
        IsEnabled = true;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(
        EmailProvider provider,
        string smtpHost,
        int smtpPort,
        bool useSsl,
        string username,
        string encryptedPassword,
        string fromEmail,
        string fromName)
    {
        Provider = provider;
        SmtpHost = smtpHost;
        SmtpPort = smtpPort;
        UseSsl = useSsl;
        Username = username;
        EncryptedPassword = encryptedPassword;
        FromEmail = fromEmail;
        FromName = fromName;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetEnabled(bool enabled)
    {
        IsEnabled = enabled;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RecordTestResult(bool successful)
    {
        LastTestedAt = DateTime.UtcNow;
        LastTestSuccessful = successful;
        UpdatedAt = DateTime.UtcNow;
    }

    public static (string Host, int Port, bool UseSsl) GetProviderDefaults(EmailProvider provider)
    {
        return provider switch
        {
            EmailProvider.Gmail => ("smtp.gmail.com", 587, true),
            EmailProvider.Outlook => ("smtp.office365.com", 587, true),
            _ => ("", 587, true)
        };
    }
}
