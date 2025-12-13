using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Identity;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserRepository(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        var dbModel = await _userManager.FindByIdAsync(id.ToString());
        return dbModel != null ? MapToDomain(dbModel) : null;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        var dbModel = await _userManager.FindByEmailAsync(email);
        return dbModel != null ? MapToDomain(dbModel) : null;
    }

    public async Task<List<User>> GetUsersAsync()
    {
        var dbModels = await _userManager.Users.ToListAsync();
        return dbModels.Select(MapToDomain).ToList();
    }

    public async Task<User> AddAsync(User user)
    {
        var dbModel = MapToDbModel(user);
        await _userManager.CreateAsync(dbModel);
        return MapToDomain(dbModel);
    }

    public async Task UpdateAsync(User user)
    {
        var dbModel = await _userManager.FindByIdAsync(user.Id.ToString());
        if (dbModel != null)
        {
            // Update properties
            dbModel.Name = user.Name;
            dbModel.Email = user.Email;
            await _userManager.UpdateAsync(dbModel);
        }
    }

    public async Task DeleteAsync(Guid id)
    {
        var dbModel = await _userManager.FindByIdAsync(id.ToString());
        if (dbModel != null)
        {
            await _userManager.DeleteAsync(dbModel);
        }
    }

    private User MapToDomain(ApplicationUser dbModel)
    {
        return new User(
            id: dbModel.Id,
            email: dbModel.Email ?? string.Empty,
            name: dbModel.Name,
            locale: dbModel.Locale,
            profilePicture: dbModel.ProfilePicture,
            createdAt: dbModel.CreatedAt,
            updatedAt: dbModel.UpdatedAt
        );
    }

    private ApplicationUser MapToDbModel(User domainUser)
    {
        return new ApplicationUser
        {
            Id = domainUser.Id,
            Email = domainUser.Email,
            UserName = domainUser.Email,
            Name = domainUser.Name,
            Locale = domainUser.Locale,
        };
    }
}
