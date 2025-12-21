using Nory.Application.Common;
using Nory.Core.Domain.Enums;

namespace Nory.Application.Services;

public interface IEmailService
{
    Task<Result<EmailConfigurationDto>> GetConfigurationAsync(CancellationToken cancellationToken = default);
    Task<Result<EmailConfigurationDto>> ConfigureAsync(ConfigureEmailRequest request, CancellationToken cancellationToken = default);
    Task<Result> TestConnectionAsync(CancellationToken cancellationToken = default);
    Task<Result> SendEmailAsync(string to, string subject, string body, bool isHtml = false, CancellationToken cancellationToken = default);
    Task<Result> DisableAsync(CancellationToken cancellationToken = default);
}

public class ConfigureEmailRequest
{
    public EmailProvider Provider { get; set; }
    public string SmtpHost { get; set; } = null!;
    public int SmtpPort { get; set; }
    public bool UseSsl { get; set; }
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string FromEmail { get; set; } = null!;
    public string FromName { get; set; } = null!;
}

public class EmailConfigurationDto
{
    public bool IsEnabled { get; set; }
    public EmailProvider Provider { get; set; }
    public string SmtpHost { get; set; } = null!;
    public int SmtpPort { get; set; }
    public bool UseSsl { get; set; }
    public string Username { get; set; } = null!;
    public string FromEmail { get; set; } = null!;
    public string FromName { get; set; } = null!;
    public DateTime? LastTestedAt { get; set; }
    public bool? LastTestSuccessful { get; set; }
}
