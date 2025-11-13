namespace Nory.Core.Domain.Entities;

public class Photo
{
    public Guid Id { get; private set; }
    public Guid EventId { get; private set; }
    public string FileName { get; private set; }
    public string OriginalFileName { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Photo() { }

    public Photo(Guid eventId, string fileName, string originalFileName)
    {
        if (string.IsNullOrWhiteSpace(fileName))
            throw new ArgumentException("File name is required");

        Id = Guid.NewGuid();
        EventId = eventId;
        FileName = fileName;
        OriginalFileName = originalFileName;
        CreatedAt = DateTime.UtcNow;
    }
}
