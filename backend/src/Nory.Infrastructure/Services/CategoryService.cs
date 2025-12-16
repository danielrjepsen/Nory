using System.Text.Encodings.Web;
using Microsoft.Extensions.Logging;
using Nory.Application.Common;
using Nory.Application.DTOs;
using Nory.Application.Services;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Persistence.Extensions;

namespace Nory.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IEventRepository _eventRepository;
    private readonly ILogger<CategoryService> _logger;

    public CategoryService(
        ICategoryRepository categoryRepository,
        IEventRepository eventRepository,
        ILogger<CategoryService> logger)
    {
        _categoryRepository = categoryRepository;
        _eventRepository = eventRepository;
        _logger = logger;
    }

    public async Task<Result<CategoriesResponse>> GetCategoriesAsync(
        Guid eventId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        if (!await _eventRepository.IsOwnedByUserAsync(eventId, userId, cancellationToken))
            return Result<CategoriesResponse>.NotFound("Event not found or access denied");

        var categories = await _categoryRepository.GetByEventIdAsync(eventId, cancellationToken);
        var dtos = categories.Select(c => c.MapToDto()).ToList();

        return Result<CategoriesResponse>.Success(new CategoriesResponse(true, dtos, dtos.Count));
    }

    public async Task<Result<CategoryDto>> CreateCategoryAsync(
        Guid eventId,
        string userId,
        CreateCategoryCommand command,
        CancellationToken cancellationToken = default)
    {
        if (!await _eventRepository.IsOwnedByUserAsync(eventId, userId, cancellationToken))
            return Result<CategoryDto>.NotFound("Event not found or access denied");

        if (await _categoryRepository.NameExistsAsync(eventId, command.Name, null, cancellationToken))
            return Result<CategoryDto>.BadRequest("A category with this name already exists");

        var category = EventCategory.Create(
            eventId,
            SanitizeInput(command.Name),
            command.Description != null ? SanitizeInput(command.Description) : null,
            command.SortOrder ?? 0);

        _categoryRepository.Add(category);
        await _categoryRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created category {CategoryId} for event {EventId}", category.Id, eventId);

        return Result<CategoryDto>.Success(category.MapToDto());
    }

    public async Task<Result<CategoryDto>> UpdateCategoryAsync(
        Guid eventId,
        Guid categoryId,
        string userId,
        UpdateCategoryCommand command,
        CancellationToken cancellationToken = default)
    {
        if (!await _eventRepository.IsOwnedByUserAsync(eventId, userId, cancellationToken))
            return Result<CategoryDto>.NotFound("Category not found or access denied");

        var category = await _categoryRepository.GetByIdAsync(categoryId, eventId, cancellationToken);
        if (category is null)
            return Result<CategoryDto>.NotFound("Category not found or access denied");

        if (await _categoryRepository.NameExistsAsync(eventId, command.Name, categoryId, cancellationToken))
            return Result<CategoryDto>.BadRequest("A category with this name already exists");

        category.Update(
            SanitizeInput(command.Name),
            command.Description != null ? SanitizeInput(command.Description) : null,
            command.SortOrder);

        _categoryRepository.Update(category);
        await _categoryRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated category {CategoryId}", categoryId);

        return Result<CategoryDto>.Success(category.MapToDto());
    }

    public async Task<Result> DeleteCategoryAsync(
        Guid eventId,
        Guid categoryId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        if (!await _eventRepository.IsOwnedByUserAsync(eventId, userId, cancellationToken))
            return Result.NotFound("Category not found or access denied");

        var category = await _categoryRepository.GetByIdAsync(categoryId, eventId, cancellationToken);
        if (category is null)
            return Result.NotFound("Category not found or access denied");

        if (category.IsDefault)
            return Result.BadRequest("Cannot delete the default category");

        _categoryRepository.Remove(category);
        await _categoryRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted category {CategoryId}", categoryId);

        return Result.Success();
    }

    public async Task<Result> ReorderCategoriesAsync(
        Guid eventId,
        string userId,
        ReorderCategoriesCommand command,
        CancellationToken cancellationToken = default)
    {
        if (!await _eventRepository.IsOwnedByUserAsync(eventId, userId, cancellationToken))
            return Result.NotFound("Event not found or access denied");

        if (command.CategoryIds.Count > 100)
            return Result.BadRequest("Cannot reorder more than 100 categories");

        if (command.CategoryIds.Count != command.CategoryIds.Distinct().Count())
            return Result.BadRequest("Duplicate category IDs are not allowed");

        var categories = await _categoryRepository.GetByEventIdAsync(eventId, cancellationToken);
        var categoryDict = categories.ToDictionary(c => c.Id);

        if (!command.CategoryIds.All(id => categoryDict.ContainsKey(id)))
            return Result.BadRequest("Invalid category IDs provided");

        for (var i = 0; i < command.CategoryIds.Count; i++)
        {
            var category = categoryDict[command.CategoryIds[i]];
            category.SetSortOrder(i);
            _categoryRepository.Update(category);
        }

        await _categoryRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Reordered {Count} categories for event {EventId}",
            command.CategoryIds.Count, eventId);

        return Result.Success();
    }

    private static string SanitizeInput(string input) => HtmlEncoder.Default.Encode(input.Trim());
}
