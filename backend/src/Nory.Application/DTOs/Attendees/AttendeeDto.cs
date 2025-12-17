namespace Nory.Application.DTOs.Attendees;

public record AttendeeStatusDto
{
    public bool IsRegistered { get; init; }
    public string? Name { get; init; }
    public string? Email { get; init; }
    public bool HasPhotoRevealConsent { get; init; }
}

public record RegisterAttendeeRequestDto
{
    public string Name { get; init; } = string.Empty;
    public string? Email { get; init; }
    public bool WantsPhotoReveal { get; init; }
}

public record RegisterAttendeeResponseDto
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
    public string? AttendeeId { get; init; }
}

public record UpdateConsentRequestDto
{
    public bool? WantsPhotoReveal { get; init; }
    public string? Email { get; init; }
}

public record UpdateConsentResponseDto
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
}
