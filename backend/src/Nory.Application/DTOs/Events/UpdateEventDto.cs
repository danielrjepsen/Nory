namespace Nory.Application.DTOs.Events;

public class UpdateEventDto
{
    public string? Name { get; init; }
    public string? Description { get; init; }
    public string? Location { get; init; }
    public DateTime? StartsAt { get; init; }
    public DateTime? EndsAt { get; init; }
    public string? Status { get; init; }
    public bool? IsPublic { get; init; }
    public Dictionary<string, object>? GuestAppConfig { get; init; }
    public string? ThemeName { get; init; }
}
