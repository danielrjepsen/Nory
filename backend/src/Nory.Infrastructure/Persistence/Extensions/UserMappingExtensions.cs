using Nory.Application.DTOs.Auth;
using Nory.Core.Domain.Entities;
using Nory.Infrastructure.Identity;

namespace Nory.Infrastructure.Persistence.Extensions;

public static class UserMappingExtensions
{
    public static UserDto MapToDto(this ApplicationUser user)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email!,
            Name = user.Name ?? user.Email!,
            EmailVerified = user.EmailConfirmed,
            ProfilePicture = user.ProfilePicture,
            CreatedAt = user.CreatedAt,
        };
    }

    public static User MapToDomain(this ApplicationUser appUser)
    {
        return new User(
            id: appUser.Id,
            email: appUser.Email!,
            name: appUser.Name,
            locale: appUser.Locale,
            profilePicture: appUser.ProfilePicture,
            createdAt: appUser.CreatedAt,
            updatedAt: appUser.UpdatedAt
        );
    }

    public static ApplicationUser MapToApplicationUser(this User user)
    {
        return new ApplicationUser
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Locale = user.Locale,
            ProfilePicture = user.ProfilePicture,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
        };
    }
}
