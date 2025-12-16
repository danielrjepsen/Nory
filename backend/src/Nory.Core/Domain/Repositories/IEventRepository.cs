namespace Nory.Core.Domain.Repositories;

using Nory.Core.Domain.Entities;

public interface IEventRepository
{
    // Queries
    Task<IReadOnlyList<Event>> GetByUserIdAsync(string userId, CancellationToken cancellationToken = default);
    Task<Event?> GetByIdAsync(Guid eventId, CancellationToken cancellationToken = default);
    Task<Event?> GetByIdWithPhotosAsync(Guid eventId, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid eventId, CancellationToken cancellationToken = default);
    Task<bool> IsOwnedByUserAsync(Guid eventId, string userId, CancellationToken cancellationToken = default);
    Task<int> CountByUserIdAsync(string userId, CancellationToken cancellationToken = default);

    // Commands
    void Add(Event eventEntity);
    void Update(Event eventEntity);
    void Remove(Event eventEntity);

    // Unit of Work
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
