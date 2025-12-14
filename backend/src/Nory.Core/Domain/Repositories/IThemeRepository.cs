namespace Nory.Core.Domain.Repositories;

using Nory.Core.Domain.Entities;

public interface IThemeRepository
{
    // Queries
    Task<IReadOnlyList<Theme>> GetAllActiveAsync(CancellationToken cancellationToken = default);
    Task<Theme?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Theme?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(string name, CancellationToken cancellationToken = default);

    // Commands
    void Add(Theme theme);
    void AddRange(IEnumerable<Theme> themes);
    void Update(Theme theme);
    void Remove(Theme theme);

    // Unit of Work
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
