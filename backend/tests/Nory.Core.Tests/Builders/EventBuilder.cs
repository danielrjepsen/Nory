using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Enums;

namespace Nory.Core.Tests.Builders;

public class EventBuilder
{
    private Guid _id = Guid.NewGuid();
    private string _userId = "test-user-id";
    private string _name = "Test Event";
    private string? _description = "Test Description";
    private string? _location = "Test Location";
    private DateTime? _startsAt = DateTime.UtcNow.AddDays(1);
    private DateTime? _endsAt = DateTime.UtcNow.AddDays(2);
    private EventStatus _status = EventStatus.Draft;
    private bool _isPublic = true;
    private bool _hasContent;
    private string? _themeName;
    private DateTime _createdAt = DateTime.UtcNow;
    private DateTime _updatedAt = DateTime.UtcNow;

    public EventBuilder WithId(Guid id) { _id = id; return this; }
    public EventBuilder WithUserId(string userId) { _userId = userId; return this; }
    public EventBuilder WithName(string name) { _name = name; return this; }
    public EventBuilder WithDescription(string? description) { _description = description; return this; }
    public EventBuilder WithLocation(string? location) { _location = location; return this; }
    public EventBuilder WithDates(DateTime? startsAt, DateTime? endsAt) { _startsAt = startsAt; _endsAt = endsAt; return this; }
    public EventBuilder WithStatus(EventStatus status) { _status = status; return this; }
    public EventBuilder AsLive() { _status = EventStatus.Live; return this; }
    public EventBuilder AsDraft() { _status = EventStatus.Draft; return this; }
    public EventBuilder AsEnded() { _status = EventStatus.Ended; return this; }
    public EventBuilder AsArchived() { _status = EventStatus.Archived; return this; }
    public EventBuilder AsPrivate() { _isPublic = false; return this; }
    public EventBuilder AsPublic() { _isPublic = true; return this; }
    public EventBuilder WithContent() { _hasContent = true; return this; }
    public EventBuilder WithTheme(string themeName) { _themeName = themeName; return this; }
    public EventBuilder CreatedAt(DateTime createdAt) { _createdAt = createdAt; return this; }

    public Event Build() => new(_id, _userId, _name, _description, _location, _startsAt, _endsAt,
        _status, _isPublic, _hasContent, _themeName, _createdAt, _updatedAt);

    public Event Create() => Event.Create(_userId, _name, _description, _location, _startsAt, _endsAt, _isPublic, _themeName);

    public static EventBuilder Default() => new();
    public static EventBuilder LiveEvent() => new EventBuilder().AsLive();
    public static EventBuilder ArchivedEvent() => new EventBuilder().AsArchived();
}
