using Nory.Application.Common;
using Nory.Application.DTOs;

namespace Nory.Application.Services;

public interface ICategoryService
{
    Task<Result<CategoriesResponse>> GetCategoriesAsync(
        Guid eventId,
        string userId,
        CancellationToken cancellationToken = default);

    Task<Result<CategoryDto>> CreateCategoryAsync(
        Guid eventId,
        string userId,
        CreateCategoryCommand command,
        CancellationToken cancellationToken = default);

    Task<Result<CategoryDto>> UpdateCategoryAsync(
        Guid eventId,
        Guid categoryId,
        string userId,
        UpdateCategoryCommand command,
        CancellationToken cancellationToken = default);

    Task<Result> DeleteCategoryAsync(
        Guid eventId,
        Guid categoryId,
        string userId,
        CancellationToken cancellationToken = default);

    Task<Result> ReorderCategoriesAsync(
        Guid eventId,
        string userId,
        ReorderCategoriesCommand command,
        CancellationToken cancellationToken = default);
}
