using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nory.Application.DTOs.Auth;
using Nory.Application.Services;

namespace Nory.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { user = result.User });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Registration failed for email {Email}", request.Email);
            return StatusCode(500, new { error = "Registration failed" });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { user = result.User });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login failed for email {Email}", request.Email);
            return StatusCode(500, new { error = "Login failed" });
        }
    }

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
    {
        try
        {
            var result = await _authService.VerifyEmailAsync(request.UserId, request.Token);

            if (!result)
                return BadRequest(new { error = "Invalid or expired verification token" });

            return Ok(new { message = "Email verified successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Email verification failed for user {UserId}", request.UserId);
            return StatusCode(500, new { error = "Email verification failed" });
        }
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            await _authService.SendPasswordResetEmailAsync(request.Email);
            return Ok(new { message = "If that email exists, a password reset link has been sent" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Password reset request failed");
            return StatusCode(500, new { error = "Failed to process password reset" });
        }
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            var result = await _authService.ResetPasswordAsync(
                request.UserId,
                request.Token,
                request.NewPassword);

            if (!result)
                return BadRequest(new { error = "Invalid or expired reset token" });

            return Ok(new { message = "Password reset successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Password reset failed");
            return StatusCode(500, new { error = "Password reset failed" });
        }
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var user = await _authService.GetCurrentUserAsync(userId);
            if (user == null)
                return NotFound(new { error = "User not found" });

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get current user");
            return StatusCode(500, new { error = "Failed to get user" });
        }
    }

    [HttpPut("me")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var result = await _authService.UpdateProfileAsync(userId, request);

            if (!result.Success)
                return BadRequest(new { errors = result.Errors });

            return Ok(result.User);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Profile update failed");
            return StatusCode(500, new { error = "Profile update failed" });
        }
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var result = await _authService.ChangePasswordAsync(
                userId,
                request.CurrentPassword,
                request.NewPassword);

            if (!result)
                return BadRequest(new { error = "Current password is incorrect" });

            return Ok(new { message = "Password changed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Password change failed");
            return StatusCode(500, new { error = "Password change failed" });
        }
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId != null)
                await _authService.LogoutAsync(userId);

            return Ok(new { message = "Logged out successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Logout failed");
            return StatusCode(500, new { error = "Logout failed" });
        }
    }

    private string? GetCurrentUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
}
