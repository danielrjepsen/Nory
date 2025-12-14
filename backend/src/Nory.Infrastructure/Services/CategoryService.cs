using System.Text.Encodings.Web;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Nory.Application.Common;
using Nory.Application.DTOs;
using Nory.Application.Services;
using Nory.Infrastructure.Persistence;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CategoryService> _logger;

    public CategoryService(ApplicationDbContext context, ILogger<CategoryService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Result<CategoriesResponse>> GetCategoriesAsync(
        Guid eventId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        if (!await UserOwnsEventAsync(eventId, userId, cancellationToken))
        {
            return Result<CategoriesResponse>.NotFound("Event not found or access denied");
        }

        var categories = await _context.EventCategories
            .AsNoTracking()
            .Where(c => c.EventId == eventId)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .Select(c => new CategoryDto(
                c.Id,
                c.Name,
                c.Description,
                c.SortOrder,
                c.IsDefault,
                c.Photos.Count,
                c.CreatedAt,
                c.UpdatedAt
            ))
            .ToListAsync(cancellationToken);

        return Result<CategoriesResponse>.Success(
            new CategoriesResponse(true, categories, categories.Count));
    }

    public async Task<Result<CategoryDto>> CreateCategoryAsync(
        Guid eventId,
        string userId,
        CreateCategoryCommand command,
        CancellationToken cancellationToken = default)
    {
        if (!await UserOwnsEventAsync(eventId, userId, cancellationToken))
        {
            return Result<CategoryDto>.NotFound("Event not found or access denied");
        }

        if (await CategoryNameExistsAsync(eventId, command.Name, null, cancellationToken))
        {
            return Result<CategoryDto>.BadRequest("A category with this name already exists");
        }

        var category = new EventCategoryDbModel
        {
            Id = Guid.NewGuid(),
            EventId = eventId,
            Name = SanitizeInput(command.Name),
            Description = command.Description != null ? SanitizeInput(command.Description) : null,
            SortOrder = command.SortOrder ?? 0,
            IsDefault = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        _context.EventCategories.Add(category);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created category {CategoryId} for event {EventId}", category.Id, eventId);

        return Result<CategoryDto>.Success(MapToDto(category, 0));
    }

    public async Task<Result<CategoryDto>> UpdateCategoryAsync(
        Guid eventId,
        Guid categoryId,
        string userId,
        UpdateCategoryCommand command,
        CancellationToken cancellationToken = default)
    {
        var category = await _context.EventCategories
            .Include(c => c.Event)
            .Include(c => c.Photos)
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.EventId == eventId, cancellationToken);

        if (category?.Event is null || category.Event.UserId != userId)
        {
            return Result<CategoryDto>.NotFound("Category not found or access denied");
        }

        if (await CategoryNameExistsAsync(eventId, command.Name, categoryId, cancellationToken))
        {
            return Result<CategoryDto>.BadRequest("A category with this name already exists");
        }

        category.Name = SanitizeInput(command.Name);
        category.Description = command.Description != null ? SanitizeInput(command.Description) : null;

        if (command.SortOrder.HasValue)
        {
            category.SortOrder = command.SortOrder.Value;
        }

        category.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated category {CategoryId}", categoryId);

        return Result<CategoryDto>.Success(MapToDto(category, category.Photos.Count));
    }

    public async Task<Result> DeleteCategoryAsync(
        Guid eventId,
        Guid categoryId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var category = await _context.EventCategories
            .Include(c => c.Event)
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.EventId == eventId, cancellationToken);

        if (category?.Event is null || category.Event.UserId != userId)
        {
            return Result.NotFound("Category not found or access denied");
        }

        if (category.IsDefault)
        {
            return Result.BadRequest("Cannot delete the default category");
        }

        _context.EventCategories.Remove(category);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted category {CategoryId}", categoryId);

        return Result.Success();
    }

    public async Task<Result> ReorderCategoriesAsync(
        Guid eventId,
        string userId,
        ReorderCategoriesCommand command,
        CancellationToken cancellationToken = default)
    {
        if (!await UserOwnsEventAsync(eventId, userId, cancellationToken))
        {
            return Result.NotFound("Event not found or access denied");
        }

        if (command.CategoryIds.Count > 100)
        {
            return Result.BadRequest("Cannot reorder more than 100 categories");
        }

        if (command.CategoryIds.Count != command.CategoryIds.Distinct().Count())
        {
            return Result.BadRequest("Duplicate category IDs are not allowed");
        }

        var categories = await _context.EventCategories
            .Where(c => c.EventId == eventId && command.CategoryIds.Contains(c.Id))
            .ToListAsync(cancellationToken);

        if (categories.Count != command.CategoryIds.Count)
        {
            return Result.BadRequest("Invalid category IDs provided");
        }

        for (var i = 0; i < command.CategoryIds.Count; i++)
        {
            var category = categories.First(c => c.Id == command.CategoryIds[i]);
            category.SortOrder = i;
            category.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Reordered {Count} categories for event {EventId}",
            command.CategoryIds.Count, eventId);

        return Result.Success();
    }

    private async Task<bool> UserOwnsEventAsync(
        Guid eventId,
        string userId,
        CancellationToken cancellationToken)
    {
        return await _context.Events.AnyAsync(
            e => e.Id == eventId && e.UserId == userId,
            cancellationToken);
    }

    private async Task<bool> CategoryNameExistsAsync(
        Guid eventId,
        string name,
        Guid? excludeCategoryId,
        CancellationToken cancellationToken)
    {
        var query = _context.EventCategories
            .Where(c => c.EventId == eventId && c.Name == name);

        if (excludeCategoryId.HasValue)
        {
            query = query.Where(c => c.Id != excludeCategoryId.Value);
        }

        return await query.AnyAsync(cancellationToken);
    }

    private static string SanitizeInput(string input)
    {
        return HtmlEncoder.Default.Encode(input.Trim());
    }

    private static CategoryDto MapToDto(EventCategoryDbModel category, int photoCount)
    {
        return new CategoryDto(
            category.Id,
            category.Name,
            category.Description,
            category.SortOrder,
            category.IsDefault,
            photoCount,
            category.CreatedAt,
            category.UpdatedAt
        );
    }
}
