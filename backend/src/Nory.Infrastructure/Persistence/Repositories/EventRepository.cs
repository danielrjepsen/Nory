using Microsoft.EntityFrameworkCore;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Enums;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Persistence.Extensions;

namespace Nory.Infrastructure.Persistence.Repositories;

public class EventRepository : IEventRepository
{
    private readonly ApplicationDbContext _context;

    public EventRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Event>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var dbModels = await _context.Events
            .Where(e => e.Status != EventStatus.Archived)
            .OrderByDescending(e => e.CreatedAt)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return dbModels.MapToDomain();
    }

    public async Task<IReadOnlyList<Event>> GetPublicAsync(CancellationToken cancellationToken = default)
    {
        var dbModels = await _context.Events
            .Where(e => e.IsPublic && e.Status == EventStatus.Live)
            .OrderByDescending(e => e.StartsAt ?? e.CreatedAt)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return dbModels.MapToDomain();
    }

    public async Task<Event?> GetByIdAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        var dbModel = await _context.Events
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == eventId, cancellationToken);

        return dbModel?.MapToDomain();
    }

    public async Task<Event?> GetByIdWithPhotosAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        var dbModel = await _context.Events
            .Include(e => e.Photos)
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == eventId, cancellationToken);

        return dbModel?.MapToDomain();
    }

    public async Task<bool> ExistsAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Events.AnyAsync(e => e.Id == eventId, cancellationToken);
    }

    public async Task<int> CountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Events
            .Where(e => e.Status != EventStatus.Archived)
            .CountAsync(cancellationToken);
    }

    public void Add(Event eventEntity)
    {
        var dbModel = eventEntity.MapToDbModel();
        _context.Events.Add(dbModel);
    }

    public void Update(Event eventEntity)
    {
        var dbModel = eventEntity.MapToDbModel();
        _context.Events.Update(dbModel);
    }

    public void Remove(Event eventEntity)
    {
        var dbModel = eventEntity.MapToDbModel();
        _context.Events.Remove(dbModel);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}
