namespace Nory.Core.Domain.Entities;

using Nory.Core.Domain.Enums;

public class Event
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public string? Location { get; private set; }
    public DateTime? StartsAt { get; private set; }
    public DateTime? EndsAt { get; private set; }
    public EventStatus Status { get; private set; }
    public bool IsPublic { get; private set; }
    public bool HasContent { get; private set; }
    public string? ThemeName { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private readonly List<Photo> _photos = new();
    public IReadOnlyCollection<Photo> Photos => _photos.AsReadOnly();

    private Event() { }

    public Event(
        Guid id,
        string name,
        string? description,
        string? location,
        DateTime? startsAt,
        DateTime? endsAt,
        EventStatus status,
        bool isPublic,
        bool hasContent,
        string? themeName,
        DateTime createdAt,
        DateTime updatedAt)
    {
        Id = id;
        Name = name;
        Description = description;
        Location = location;
        StartsAt = startsAt;
        EndsAt = endsAt;
        Status = status;
        IsPublic = isPublic;
        HasContent = hasContent;
        ThemeName = themeName;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }

    public static Event Create(
        string name,
        string? description = null,
        string? location = null,
        DateTime? startsAt = null,
        DateTime? endsAt = null,
        bool isPublic = true,
        string? themeName = null)
    {
        ValidateName(name);
        ValidateDateRange(startsAt, endsAt);

        return new Event(
            id: Guid.NewGuid(),
            name: name.Trim(),
            description: description?.Trim(),
            location: location?.Trim(),
            startsAt: startsAt,
            endsAt: endsAt,
            status: EventStatus.Draft,
            isPublic: isPublic,
            hasContent: false,
            themeName: themeName,
            createdAt: DateTime.UtcNow,
            updatedAt: DateTime.UtcNow
        );
    }

    public void UpdateDetails(
        string? name = null,
        string? description = null,
        string? location = null,
        DateTime? startsAt = null,
        DateTime? endsAt = null,
        bool? isPublic = null,
        string? themeName = null)
    {
        if (Status == EventStatus.Archived)
            throw new InvalidOperationException("Cannot modify an archived event");

        if (name is not null)
        {
            ValidateName(name);
            Name = name.Trim();
        }

        if (description is not null)
            Description = description.Trim();

        if (location is not null)
            Location = location.Trim();

        if (startsAt.HasValue || endsAt.HasValue)
        {
            var newStartsAt = startsAt ?? StartsAt;
            var newEndsAt = endsAt ?? EndsAt;
            ValidateDateRange(newStartsAt, newEndsAt);
            StartsAt = newStartsAt;
            EndsAt = newEndsAt;
        }

        if (isPublic.HasValue)
            IsPublic = isPublic.Value;

        if (themeName is not null)
            ThemeName = themeName;

        UpdatedAt = DateTime.UtcNow;
    }

    public void Start()
    {
        if (Status != EventStatus.Draft)
            throw new InvalidOperationException("Only draft events can be started");

        Status = EventStatus.Live;
        UpdatedAt = DateTime.UtcNow;
    }

    public void End()
    {
        if (Status != EventStatus.Live)
            throw new InvalidOperationException("Only live events can be ended");

        Status = EventStatus.Ended;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Archive()
    {
        if (Status == EventStatus.Live)
            throw new InvalidOperationException("Cannot archive a live event. End it first.");

        Status = EventStatus.Archived;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddPhoto(Photo photo)
    {
        if (Status != EventStatus.Live)
            throw new InvalidOperationException("Can only add photos to live events");

        _photos.Add(photo);
        HasContent = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkHasContent()
    {
        if (!HasContent)
        {
            HasContent = true;
            UpdatedAt = DateTime.UtcNow;
        }
    }

    private static void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Event name is required", nameof(name));

        if (name.Length > 200)
            throw new ArgumentException("Event name cannot exceed 200 characters", nameof(name));
    }

    private static void ValidateDateRange(DateTime? startsAt, DateTime? endsAt)
    {
        if (startsAt.HasValue && endsAt.HasValue && endsAt < startsAt)
            throw new ArgumentException("End date cannot be before start date");
    }
}
