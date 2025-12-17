using Microsoft.AspNetCore.Mvc;
using Nory.Application.DTOs.Setup;
using Nory.Application.Services;

namespace Nory.Controllers;

[ApiController]
[Route("api/v1/setup")]
public class SetupController : ControllerBase
{
    private readonly ISetupService _setupService;
    private readonly ILogger<SetupController> _logger;

    public SetupController(ISetupService setupService, ILogger<SetupController> logger)
    {
        _setupService = setupService;
        _logger = logger;
    }

    /// <summary>
    /// Get the current setup status of the application.
    /// This endpoint is public and used to determine if the setup wizard should be shown.
    /// </summary>
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus()
    {
        try
        {
            var status = await _setupService.GetStatusAsync();
            return Ok(status);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get setup status");
            return StatusCode(500, new { error = "Failed to check setup status" });
        }
    }

    /// <summary>
    /// Complete the initial setup of the application.
    /// SECURITY: This endpoint can only be called ONCE - when no admin user exists.
    /// After setup is complete, this endpoint returns 403 Forbidden.
    /// </summary>
    [HttpPost("complete")]
    public async Task<IActionResult> CompleteSetup([FromBody] CompleteSetupRequest request)
    {
        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

        try
        {
            // SECURITY: Check setup status FIRST before processing any request data
            var status = await _setupService.GetStatusAsync();
            if (status.IsConfigured)
            {
                _logger.LogWarning(
                    "SECURITY: Blocked setup attempt on already configured instance. IP: {ClientIp}, Email attempted: {Email}",
                    clientIp,
                    request?.AdminAccount?.Email ?? "not provided");

                // Return 403 Forbidden - setup is locked
                return StatusCode(403, new { error = "Setup has already been completed. This endpoint is now disabled." });
            }

            var result = await _setupService.CompleteSetupAsync(request);

            if (!result.Success)
            {
                _logger.LogWarning("Setup validation failed from IP: {ClientIp}", clientIp);
                return BadRequest(new { errors = result.Errors });
            }

            _logger.LogInformation(
                "Setup completed successfully. Admin email: {Email}, IP: {ClientIp}",
                request.AdminAccount.Email,
                clientIp);

            return Ok(new { message = "Setup completed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to complete setup from IP: {ClientIp}", clientIp);
            return StatusCode(500, new { error = "Failed to complete setup" });
        }
    }
}
