namespace Nory.Application.DTOs.Attendees;

public record EventAttendeeListDto
{
    public IReadOnlyList<EventAttendeeItemDto> Attendees { get; init; } = [];
    public int TotalCount { get; init; }
}

public record EventAttendeeItemDto
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string? Email { get; init; }
    public bool HasPhotoRevealConsent { get; init; }
    public DateTime RegisteredAt { get; init; }
}
