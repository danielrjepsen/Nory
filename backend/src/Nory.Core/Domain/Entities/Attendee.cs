namespace Nory.Core.Domain.Entities;

/// <summary>
/// Represents an event attendee. Stores minimal data for GDPR compliance.
/// Session identification is handled via HTTP-only cookies, not stored here.
/// </summary>
public class Attendee
{
    public Guid Id { get; private set; }
    public Guid EventId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string? Email { get; private set; }
    public bool HasPhotoRevealConsent { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public DateTime? DeletedAt { get; private set; }

    public Event? Event { get; private set; }

    private Attendee() { }

    public Attendee(
        Guid id,
        Guid eventId,
        string name,
        string? email,
        bool hasPhotoRevealConsent,
        DateTime createdAt,
        DateTime? updatedAt,
        DateTime? deletedAt)
    {
        Id = id;
        EventId = eventId;
        Name = name;
        Email = email;
        HasPhotoRevealConsent = hasPhotoRevealConsent;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
        DeletedAt = deletedAt;
    }

    public static Attendee Create(
        Guid eventId,
        string name,
        string? email = null,
        bool wantsPhotoReveal = false)
    {
        ValidateName(name);
        ValidateEmail(email);

        return new Attendee(
            id: Guid.NewGuid(),
            eventId: eventId,
            name: name.Trim(),
            email: email?.Trim().ToLowerInvariant(),
            hasPhotoRevealConsent: wantsPhotoReveal,
            createdAt: DateTime.UtcNow,
            updatedAt: null,
            deletedAt: null
        );
    }

    public void UpdateConsent(bool wantsPhotoReveal, string? email = null)
    {
        if (email is not null)
        {
            ValidateEmail(email);
            Email = email.Trim().ToLowerInvariant();
        }

        HasPhotoRevealConsent = wantsPhotoReveal;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateName(string name)
    {
        ValidateName(name);
        Name = name.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Soft delete for GDPR "right to be forgotten".
    /// Anonymizes personal data while preserving aggregate metrics.
    /// </summary>
    public void Anonymize()
    {
        Name = "Deleted User";
        Email = null;
        HasPhotoRevealConsent = false;
        DeletedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsDeleted => DeletedAt.HasValue;

    public bool BelongsToEvent(Guid eventId) => EventId == eventId;

    private static void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Attendee name is required", nameof(name));

        if (name.Length > 100)
            throw new ArgumentException("Attendee name cannot exceed 100 characters", nameof(name));
    }

    private static void ValidateEmail(string? email)
    {
        if (email is null) return;

        if (email.Length > 255)
            throw new ArgumentException("Email cannot exceed 255 characters", nameof(email));

        if (!email.Contains('@') || !email.Contains('.'))
            throw new ArgumentException("Invalid email format", nameof(email));
    }
}
