using Nory.Core.Domain.Entities;

namespace Nory.Core.Domain.Repositories;

public interface IEventPhotoRepository
{
    Task<EventPhoto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<EventPhoto?> GetByIdWithEventAsync(Guid id, Guid eventId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<EventPhoto>> GetByEventIdAsync(Guid eventId, Guid? categoryId = null, int limit = 50, int offset = 0, CancellationToken cancellationToken = default);
    void Add(EventPhoto photo);
    void AddRange(IEnumerable<EventPhoto> photos);
    void Update(EventPhoto photo);
    void Remove(EventPhoto photo);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
