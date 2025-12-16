namespace Nory.Core.Domain.Entities;

public class EventApp
{
    public Guid Id { get; private set; }
    public Guid EventId { get; private set; }
    public string AppTypeId { get; private set; } = null!;
    public string? Configuration { get; private set; }
    public bool IsEnabled { get; private set; }
    public int SortOrder { get; private set; }
    public AppType? AppType { get; private set; }

    private EventApp() { }

    public EventApp(
        Guid id,
        Guid eventId,
        string appTypeId,
        string? configuration,
        bool isEnabled,
        int sortOrder,
        AppType? appType = null)
    {
        Id = id;
        EventId = eventId;
        AppTypeId = appTypeId;
        Configuration = configuration;
        IsEnabled = isEnabled;
        SortOrder = sortOrder;
        AppType = appType;
    }
}
