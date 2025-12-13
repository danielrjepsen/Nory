namespace Nory.Application.DTOs.Events;

public class EventDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Location { get; init; }
    public DateTime? StartsAt { get; init; }
    public DateTime? EndsAt { get; init; }
    public string Status { get; init; } = "draft";
    public bool IsPublic { get; init; } = true;
    public bool HasContent { get; init; }
    public int PhotoCount { get; init; }
    public Dictionary<string, object>? GuestAppConfig { get; init; }
    public string? ThemeName { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}
