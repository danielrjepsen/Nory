namespace Nory.Application.DTOs.Events;

public class CreateEventDto
{
    public string Name { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Location { get; init; }
    public DateTime? StartsAt { get; init; }
    public DateTime? EndsAt { get; init; }
    public bool IsPublic { get; init; } = true;
    public string? ThemeName { get; init; }
    public Dictionary<string, object>? GuestAppConfig { get; init; }
}
