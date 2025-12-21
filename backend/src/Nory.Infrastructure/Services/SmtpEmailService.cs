using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Logging;
using Nory.Application.Common;
using Nory.Application.Services;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;

namespace Nory.Infrastructure.Services;

public class SmtpEmailService : IEmailService
{
    private readonly IEmailConfigurationRepository _repository;
    private readonly IEncryptionService _encryption;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(
        IEmailConfigurationRepository repository,
        IEncryptionService encryption,
        ILogger<SmtpEmailService> logger)
    {
        _repository = repository;
        _encryption = encryption;
        _logger = logger;
    }

    public async Task<Result<EmailConfigurationDto>> GetConfigurationAsync(CancellationToken cancellationToken = default)
    {
        var config = await _repository.GetAsync(cancellationToken);
        if (config == null)
            return Result<EmailConfigurationDto>.Success(null!);

        return Result<EmailConfigurationDto>.Success(MapToDto(config));
    }

    public async Task<Result<EmailConfigurationDto>> ConfigureAsync(
        ConfigureEmailRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var encryptedPassword = _encryption.Encrypt(request.Password);

            var existing = await _repository.GetAsync(cancellationToken);
            EmailConfiguration config;

            if (existing != null)
            {
                existing.Update(
                    request.Provider,
                    request.SmtpHost,
                    request.SmtpPort,
                    request.UseSsl,
                    request.Username,
                    encryptedPassword,
                    request.FromEmail,
                    request.FromName);
                config = existing;
            }
            else
            {
                config = new EmailConfiguration(
                    request.Provider,
                    request.SmtpHost,
                    request.SmtpPort,
                    request.UseSsl,
                    request.Username,
                    encryptedPassword,
                    request.FromEmail,
                    request.FromName);
            }

            await _repository.SaveAsync(config, cancellationToken);
            _logger.LogInformation("Email configuration saved for provider {Provider}", request.Provider);

            return Result<EmailConfigurationDto>.Success(MapToDto(config));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to configure email");
            return Result<EmailConfigurationDto>.BadRequest("Failed to save email configuration");
        }
    }

    public async Task<Result> TestConnectionAsync(CancellationToken cancellationToken = default)
    {
        var config = await _repository.GetAsync(cancellationToken);
        if (config == null)
            return Result.NotFound("Email is not configured");

        try
        {
            var password = _encryption.Decrypt(config.EncryptedPassword);

            using var client = new SmtpClient(config.SmtpHost, config.SmtpPort)
            {
                EnableSsl = config.UseSsl,
                Credentials = new NetworkCredential(config.Username, password),
                Timeout = 10000
            };

            using var message = new MailMessage
            {
                From = new MailAddress(config.FromEmail, config.FromName),
                Subject = "Test email fra Nory",
                Body = "Dette er en test email for at bekræfte din email konfiguration virker korrekt.",
                IsBodyHtml = false
            };
            message.To.Add(config.FromEmail);

            await client.SendMailAsync(message, cancellationToken);

            config.RecordTestResult(true);
            await _repository.SaveAsync(config, cancellationToken);

            _logger.LogInformation("Email test successful");
            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Email test failed");

            if (config != null)
            {
                config.RecordTestResult(false);
                await _repository.SaveAsync(config, cancellationToken);
            }

            return Result.BadRequest($"Kunne ikke sende test email: {ex.Message}");
        }
    }

    public async Task<Result> SendEmailAsync(
        string to,
        string subject,
        string body,
        bool isHtml = false,
        CancellationToken cancellationToken = default)
    {
        var config = await _repository.GetAsync(cancellationToken);
        if (config == null || !config.IsEnabled)
            return Result.NotFound("Email is not configured or disabled");

        try
        {
            var password = _encryption.Decrypt(config.EncryptedPassword);

            using var client = new SmtpClient(config.SmtpHost, config.SmtpPort)
            {
                EnableSsl = config.UseSsl,
                Credentials = new NetworkCredential(config.Username, password),
                Timeout = 30000
            };

            using var message = new MailMessage
            {
                From = new MailAddress(config.FromEmail, config.FromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = isHtml
            };
            message.To.Add(to);

            await client.SendMailAsync(message, cancellationToken);
            _logger.LogInformation("Email sent to {To}", to);

            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", to);
            return Result.BadRequest($"Failed to send email: {ex.Message}");
        }
    }

    public async Task<Result> DisableAsync(CancellationToken cancellationToken = default)
    {
        await _repository.DeleteAsync(cancellationToken);
        _logger.LogInformation("Email configuration disabled");
        return Result.Success();
    }

    private static EmailConfigurationDto MapToDto(EmailConfiguration config) => new()
    {
        IsEnabled = config.IsEnabled,
        Provider = config.Provider,
        SmtpHost = config.SmtpHost,
        SmtpPort = config.SmtpPort,
        UseSsl = config.UseSsl,
        Username = config.Username,
        FromEmail = config.FromEmail,
        FromName = config.FromName,
        LastTestedAt = config.LastTestedAt,
        LastTestSuccessful = config.LastTestSuccessful
    };
}
