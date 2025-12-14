namespace Nory.Application.DTOs;

public record CategoryDto(
    Guid Id,
    string Name,
    string? Description,
    int SortOrder,
    bool IsDefault,
    int PhotoCount,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record CategoriesResponse(
    bool Success,
    IReadOnlyList<CategoryDto> Categories,
    int TotalCount
);

public record CategoryResponse(bool Success, CategoryDto Category);

public record CreateCategoryCommand(
    string Name,
    string? Description,
    int? SortOrder
);

public record UpdateCategoryCommand(
    string Name,
    string? Description,
    int? SortOrder
);

public record ReorderCategoriesCommand(List<Guid> CategoryIds);
