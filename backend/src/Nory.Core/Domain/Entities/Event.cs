namespace Nory.Core.Domain.Entities;

using Nory.Core.Domain.Enums;

public class Event
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public DateTime? StartsAt { get; private set; }
    public DateTime? EndsAt { get; private set; }
    public EventStatus Status { get; private set; }
    public bool HasContent { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private readonly List<Photo> _photos = new();
    public IReadOnlyCollection<Photo> Photos => _photos.AsReadOnly();

    private Event() { }

    public Event(string name, DateTime? startsAt, DateTime? endsAt)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Event name is required");

        if (startsAt.HasValue && endsAt.HasValue && endsAt < startsAt)
            throw new ArgumentException("End date cannot be before start date");

        Id = Guid.NewGuid();
        Name = name;
        StartsAt = startsAt;
        EndsAt = endsAt;
        Status = EventStatus.Draft;
        CreatedAt = DateTime.UtcNow;
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

    public void AddPhoto(Photo photo)
    {
        if (Status != EventStatus.Live)
            throw new InvalidOperationException("Can only add photos to live events");

        _photos.Add(photo);
        HasContent = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateDetails(string name, string? description)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Event name is required");

        Name = name;
        Description = description;
        UpdatedAt = DateTime.UtcNow;
    }
}
