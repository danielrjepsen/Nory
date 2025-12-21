using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nory.Application.Services;
using Nory.Core.Domain.Enums;

namespace Nory.Api.Controllers;

[Route("api/v1/email")]
[Authorize]
public class EmailController(IEmailService emailService) : ApiControllerBase
{
    [HttpGet("config")]
    [ProducesResponseType(typeof(EmailConfigurationDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetConfiguration(CancellationToken cancellationToken)
    {
        var result = await emailService.GetConfigurationAsync(cancellationToken);
        return ToActionResult(result);
    }

    [HttpPost("config")]
    [ProducesResponseType(typeof(EmailConfigurationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Configure(
        [FromBody] ConfigureEmailApiRequest request,
        CancellationToken cancellationToken)
    {
        var errors = ValidateRequest(request);
        if (errors.Count > 0)
            return BadRequest(new { success = false, errors });

        var command = new ConfigureEmailRequest
        {
            Provider = request.Provider,
            SmtpHost = request.SmtpHost.Trim(),
            SmtpPort = request.SmtpPort,
            UseSsl = request.UseSsl,
            Username = request.Username.Trim(),
            Password = request.Password,
            FromEmail = request.FromEmail.Trim(),
            FromName = request.FromName.Trim()
        };

        var result = await emailService.ConfigureAsync(command, cancellationToken);

        if (!result.IsSuccess)
            return ToActionResult(result);

        return CreatedAtAction(nameof(GetConfiguration), result.Data);
    }

    [HttpDelete("config")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteConfiguration(CancellationToken cancellationToken)
    {
        var result = await emailService.DisableAsync(cancellationToken);
        return ToActionResult(result);
    }

    [HttpPost("test")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> TestConnection(CancellationToken cancellationToken)
    {
        var result = await emailService.TestConnectionAsync(cancellationToken);
        return ToActionResult(result);
    }

    private static List<string> ValidateRequest(ConfigureEmailApiRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.SmtpHost))
            errors.Add("SMTP host is required");

        if (request.SmtpPort is < 1 or > 65535)
            errors.Add("SMTP port must be between 1 and 65535");

        if (string.IsNullOrWhiteSpace(request.Username))
            errors.Add("Username is required");

        if (string.IsNullOrWhiteSpace(request.Password))
            errors.Add("Password is required");

        if (string.IsNullOrWhiteSpace(request.FromEmail))
            errors.Add("From email is required");
        else if (!IsValidEmail(request.FromEmail))
            errors.Add("From email is not valid");

        if (string.IsNullOrWhiteSpace(request.FromName))
            errors.Add("From name is required");

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
}

public record ConfigureEmailApiRequest(
    EmailProvider Provider,
    string SmtpHost,
    int SmtpPort,
    bool UseSsl,
    string Username,
    string Password,
    string FromEmail,
    string FromName
);
