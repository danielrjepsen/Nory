namespace Nory.Core.Domain.Entities;

public class EventCategory
{
    public Guid Id { get; private set; }
    public Guid EventId { get; private set; }
    public string Name { get; private set; } = null!;
    public string? Description { get; private set; }
    public int SortOrder { get; private set; }
    public bool IsDefault { get; private set; }
    public int PhotoCount { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private EventCategory() { }

    public EventCategory(
        Guid id,
        Guid eventId,
        string name,
        string? description,
        int sortOrder,
        bool isDefault,
        int photoCount,
        DateTime createdAt,
        DateTime updatedAt)
    {
        Id = id;
        EventId = eventId;
        Name = name;
        Description = description;
        SortOrder = sortOrder;
        IsDefault = isDefault;
        PhotoCount = photoCount;
        CreatedAt = createdAt;
        UpdatedAt = updatedAt;
    }

    public static EventCategory Create(Guid eventId, string name, string? description, int sortOrder = 0)
    {
        return new EventCategory(
            id: Guid.NewGuid(),
            eventId: eventId,
            name: name,
            description: description,
            sortOrder: sortOrder,
            isDefault: false,
            photoCount: 0,
            createdAt: DateTime.UtcNow,
            updatedAt: DateTime.UtcNow);
    }

    public void Update(string name, string? description, int? sortOrder)
    {
        Name = name;
        Description = description;
        if (sortOrder.HasValue)
            SortOrder = sortOrder.Value;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SetSortOrder(int sortOrder)
    {
        SortOrder = sortOrder;
        UpdatedAt = DateTime.UtcNow;
    }
}
