namespace Nory.Core.Domain.Repositories;

using Nory.Core.Domain.Entities;

public interface IAppTypeRepository
{
    Task<AppType?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AppType>> GetByIdsAsync(IEnumerable<string> ids, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<AppType>> GetActiveAsync(CancellationToken cancellationToken = default);
}
