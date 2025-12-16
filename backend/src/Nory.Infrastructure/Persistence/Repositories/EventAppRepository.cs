using Microsoft.EntityFrameworkCore;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Persistence.Extensions;

namespace Nory.Infrastructure.Persistence.Repositories;

public class EventAppRepository : IEventAppRepository
{
    private readonly ApplicationDbContext _context;

    public EventAppRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<EventApp>> GetByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        var dbModels = await _context.EventApps
            .AsNoTracking()
            .Include(ea => ea.AppType)
            .Where(ea => ea.EventId == eventId && ea.IsEnabled && ea.AppType != null && ea.AppType.IsActive)
            .OrderBy(ea => ea.SortOrder)
            .ToListAsync(cancellationToken);

        return dbModels.MapToDomain();
    }

    public async Task<EventApp?> GetByIdAsync(Guid appId, Guid eventId, CancellationToken cancellationToken = default)
    {
        var dbModel = await _context.EventApps
            .AsNoTracking()
            .Include(ea => ea.AppType)
            .FirstOrDefaultAsync(ea => ea.Id == appId && ea.EventId == eventId && ea.IsEnabled, cancellationToken);

        if (dbModel?.AppType == null || !dbModel.AppType.IsActive)
            return null;

        return dbModel.MapToDomain();
    }

    public void Add(EventApp eventApp)
    {
        var dbModel = eventApp.MapToDbModel();
        _context.EventApps.Add(dbModel);
    }

    public void AddRange(IEnumerable<EventApp> eventApps)
    {
        var dbModels = eventApps.Select(ea => ea.MapToDbModel());
        _context.EventApps.AddRange(dbModels);
    }

    public async Task RemoveByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        var existing = await _context.EventApps
            .Where(ea => ea.EventId == eventId)
            .ToListAsync(cancellationToken);

        _context.EventApps.RemoveRange(existing);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}
