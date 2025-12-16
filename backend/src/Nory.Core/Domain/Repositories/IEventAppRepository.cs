namespace Nory.Core.Domain.Repositories;

using Nory.Core.Domain.Entities;

public interface IEventAppRepository
{
    Task<IReadOnlyList<EventApp>> GetByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default);
    Task<EventApp?> GetByIdAsync(Guid appId, Guid eventId, CancellationToken cancellationToken = default);
    void Add(EventApp eventApp);
    void AddRange(IEnumerable<EventApp> eventApps);
    Task RemoveByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
