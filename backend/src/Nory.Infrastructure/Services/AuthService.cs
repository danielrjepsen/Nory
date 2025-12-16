using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Nory.Application.DTOs.Auth;
using Nory.Application.Services;
using Nory.Infrastructure.Identity;
using Nory.Infrastructure.Persistence.Extensions;

namespace Nory.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ILogger<AuthService> logger
    )
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _logger = logger;
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return new AuthResult
            {
                Success = false,
                Errors = new List<string> { "Email already registered" },
            };
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            Name = request.Name,
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            return new AuthResult
            {
                Success = false,
                Errors = result.Errors.Select(e => e.Description).ToList(),
            };
        }

        var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        await _signInManager.SignInAsync(user, isPersistent: true);

        return new AuthResult { Success = true, User = user.MapToDto() };
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return new AuthResult
            {
                Success = false,
                Errors = new List<string> { "Invalid email or password" },
            };
        }

        var result = await _signInManager.CheckPasswordSignInAsync(
            user,
            request.Password,
            lockoutOnFailure: true
        );

        if (!result.Succeeded)
        {
            var errors = new List<string>();

            if (result.IsLockedOut)
                errors.Add("Account is locked out");
            else if (result.IsNotAllowed)
                errors.Add("Account is not allowed to sign in");
            else
                errors.Add("Invalid email or password");

            return new AuthResult { Success = false, Errors = errors };
        }

        await _signInManager.SignInAsync(user, isPersistent: request.RememberMe);

        return new AuthResult { Success = true, User = user.MapToDto() };
    }

    public async Task<bool> VerifyEmailAsync(string userId, string token)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return false;

        var result = await _userManager.ConfirmEmailAsync(user, token);
        return result.Succeeded;
    }

    public async Task SendPasswordResetEmailAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return;

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        _logger.LogInformation("Password reset token generated for {Email}", email);
    }

    public async Task<bool> ResetPasswordAsync(string userId, string token, string newPassword)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return false;

        var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
        return result.Succeeded;
    }

    public async Task<bool> ChangePasswordAsync(
        string userId,
        string currentPassword,
        string newPassword
    )
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return false;

        var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
        return result.Succeeded;
    }

    public async Task<UserDto?> GetCurrentUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return null;

        return user.MapToDto();
    }

    public async Task<UpdateProfileResult> UpdateProfileAsync(
        string userId,
        UpdateProfileRequest request
    )
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return new UpdateProfileResult
            {
                Success = false,
                Errors = new List<string> { "User not found" },
            };
        }

        if (!string.IsNullOrEmpty(request.Name))
            user.Name = request.Name;

        if (!string.IsNullOrEmpty(request.ProfilePicture))
            user.ProfilePicture = request.ProfilePicture;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return new UpdateProfileResult
            {
                Success = false,
                Errors = result.Errors.Select(e => e.Description).ToList(),
            };
        }

        return new UpdateProfileResult { Success = true, User = user.MapToDto() };
    }

    public async Task LogoutAsync(string userId)
    {
        await _signInManager.SignOutAsync();
        _logger.LogInformation("User {UserId} logged out", userId);
    }
}
