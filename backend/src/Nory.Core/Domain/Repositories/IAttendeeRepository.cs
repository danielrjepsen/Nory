namespace Nory.Core.Domain.Repositories;

using Nory.Core.Domain.Entities;

public interface IAttendeeRepository
{
    // Queries
    Task<Attendee?> GetByIdAsync(Guid attendeeId, CancellationToken cancellationToken = default);
    Task<Attendee?> GetByEventAndIdAsync(Guid eventId, Guid attendeeId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Attendee>> GetByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default);
    Task<int> CountByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid attendeeId, CancellationToken cancellationToken = default);

    // Commands
    void Add(Attendee attendee);
    void Update(Attendee attendee);
    void Remove(Attendee attendee);

    // Unit of Work
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
