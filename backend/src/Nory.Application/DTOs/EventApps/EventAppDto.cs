namespace Nory.Application.DTOs.EventApps;

public record EventAppDto
{
    public string Id { get; init; } = string.Empty;
    public AppTypeDto AppType { get; init; } = null!;
    public string? Configuration { get; init; }
    public int SortOrder { get; init; }
}

public record AppTypeDto
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string Component { get; init; } = string.Empty;
    public string Icon { get; init; } = string.Empty;
    public string Color { get; init; } = string.Empty;
}
