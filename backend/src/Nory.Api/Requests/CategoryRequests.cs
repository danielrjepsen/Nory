using System.ComponentModel.DataAnnotations;

namespace Nory.Api.Requests;

public record CreateCategoryRequest
{
    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Name { get; init; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; init; }

    public int? SortOrder { get; init; }
}

public record UpdateCategoryRequest
{
    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Name { get; init; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; init; }

    public int? SortOrder { get; init; }
}

public record ReorderCategoriesRequest
{
    [Required]
    public List<Guid> CategoryIds { get; init; } = new();
}
