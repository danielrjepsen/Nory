using Nory.Application.Common;
using Nory.Application.DTOs;

namespace Nory.Application.Services;

public interface ICategoryService
{
    Task<Result<CategoriesResponse>> GetCategoriesAsync(
        Guid eventId,
        CancellationToken cancellationToken = default);

    Task<Result<CategoryDto>> CreateCategoryAsync(
        Guid eventId,
        CreateCategoryCommand command,
        CancellationToken cancellationToken = default);

    Task<Result<CategoryDto>> UpdateCategoryAsync(
        Guid eventId,
        Guid categoryId,
        UpdateCategoryCommand command,
        CancellationToken cancellationToken = default);

    Task<Result> DeleteCategoryAsync(
        Guid eventId,
        Guid categoryId,
        CancellationToken cancellationToken = default);

    Task<Result> ReorderCategoriesAsync(
        Guid eventId,
        ReorderCategoriesCommand command,
        CancellationToken cancellationToken = default);
}
