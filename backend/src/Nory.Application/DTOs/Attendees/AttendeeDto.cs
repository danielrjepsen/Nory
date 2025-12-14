namespace Nory.Application.DTOs.Attendees;

public record AttendeeStatusDto
{
    public bool IsRegistered { get; init; }
    public string? Name { get; init; }
    public string? Email { get; init; }
    public bool HasConsent { get; init; }
}

public record RegisterAttendeeRequestDto
{
    public string Name { get; init; } = string.Empty;
    public string? Email { get; init; }
    public bool PhotoConsent { get; init; }
    public bool MemoryOptIn { get; init; }
}

public record RegisterAttendeeResponseDto
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
    public string? AttendeeId { get; init; }
}

public record UpdateConsentRequestDto
{
    public bool? PhotoConsent { get; init; }
    public bool? MemoryOptIn { get; init; }
}

public record UpdateConsentResponseDto
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
}
