using System.Text.Json;
using Nory.Core.Domain.Enums;

namespace Nory.Core.Domain.Entities;

public class ActivityLog
{
    public Guid Id { get; private set; }
    public Guid EventId { get; private set; }
    public ActivityType Type { get; private set; }
    public JsonDocument? Data { get; private set; }
    public string? SessionId { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public bool IsProcessed { get; private set; }

    public Event? Event { get; private set; }

    // Constructor for EF Core reconstitution
    public ActivityLog(
        Guid id,
        Guid eventId,
        ActivityType type,
        JsonDocument? data,
        string? sessionId,
        DateTime createdAt,
        bool isProcessed)
    {
        Id = id;
        EventId = eventId;
        Type = type;
        Data = data;
        SessionId = sessionId;
        CreatedAt = createdAt;
        IsProcessed = isProcessed;
    }

    // Static factory method for creating new activity logs
    public static ActivityLog Create(
        Guid eventId,
        ActivityType type,
        JsonDocument? data = null,
        string? sessionId = null)
    {
        if (eventId == Guid.Empty)
            throw new ArgumentException("EventId is required");

        return new ActivityLog(
            id: Guid.NewGuid(),
            eventId: eventId,
            type: type,
            data: data,
            sessionId: sessionId,
            createdAt: DateTime.UtcNow,
            isProcessed: false
        );
    }

    // Business methods
    public void MarkAsProcessed()
    {
        IsProcessed = true;
    }

    public string GetDescription()
    {
        return Type switch
        {
            ActivityType.GuestAppOpened => "Guest opened the app",
            ActivityType.PhotoUploaded => GetPhotoUploadDescription(),
            ActivityType.PhotoViewed => "Photo was viewed",
            ActivityType.QrCodeScanned => "QR code was scanned",
            _ => $"Activity: {Type}",
        };
    }

    private string GetPhotoUploadDescription()
    {
        var filename = GetDataValue("filename");
        return filename != null ? $"Photo uploaded: {filename}" : "Photo was uploaded";
    }

    public string GetEventName()
    {
        return Event?.Name ?? "Unknown Event";
    }

    public bool IsPhotoActivity()
    {
        return Type == ActivityType.PhotoUploaded
            || Type == ActivityType.PhotoViewed
            || Type == ActivityType.PhotoDownloaded;
    }

    public bool IsAppActivity()
    {
        return Type == ActivityType.GuestAppOpened
            || Type == ActivityType.GalleryViewed
            || Type == ActivityType.SlideshowViewed;
    }

    public bool IsEngagementActivity()
    {
        return Type == ActivityType.QrCodeScanned
            || Type == ActivityType.EventJoined
            || Type == ActivityType.EventLeft;
    }

    // Helper methods for JsonDocument
    public string? GetDataValue(string key)
    {
        return Data?.RootElement.TryGetProperty(key, out var value) == true
            ? value.GetString()
            : null;
    }

    public T? GetDataAs<T>()
        where T : class
    {
        if (Data == null)
            return null;

        try
        {
            return JsonSerializer.Deserialize<T>(Data.RootElement.GetRawText());
        }
        catch
        {
            return null;
        }
    }

    public bool HasDataKey(string key)
    {
        return Data?.RootElement.TryGetProperty(key, out _) == true;
    }
}
