namespace Nory.Core.Domain.Repositories;

using Nory.Core.Domain.Entities;

public interface ICategoryRepository
{
    Task<IReadOnlyList<EventCategory>> GetByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default);
    Task<EventCategory?> GetByIdAsync(Guid categoryId, Guid eventId, CancellationToken cancellationToken = default);
    Task<bool> NameExistsAsync(Guid eventId, string name, Guid? excludeCategoryId = null, CancellationToken cancellationToken = default);

    void Add(EventCategory category);
    void Update(EventCategory category);
    void Remove(EventCategory category);

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
