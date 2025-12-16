using Microsoft.EntityFrameworkCore;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Persistence.Extensions;

namespace Nory.Infrastructure.Persistence.Repositories;

public class AppTypeRepository : IAppTypeRepository
{
    private readonly ApplicationDbContext _context;

    public AppTypeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AppType?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var dbModel = await _context.AppTypes
            .AsNoTracking()
            .FirstOrDefaultAsync(at => at.Id == id && at.IsActive, cancellationToken);

        return dbModel?.MapToDomain();
    }

    public async Task<IReadOnlyList<AppType>> GetByIdsAsync(IEnumerable<string> ids, CancellationToken cancellationToken = default)
    {
        var idList = ids.ToList();
        var dbModels = await _context.AppTypes
            .AsNoTracking()
            .Where(at => idList.Contains(at.Id) && at.IsActive)
            .ToListAsync(cancellationToken);

        return dbModels.MapToDomain();
    }

    public async Task<IReadOnlyList<AppType>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        var dbModels = await _context.AppTypes
            .AsNoTracking()
            .Where(at => at.IsActive)
            .ToListAsync(cancellationToken);

        return dbModels.MapToDomain();
    }
}
