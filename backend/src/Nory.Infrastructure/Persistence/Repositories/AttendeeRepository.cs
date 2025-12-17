using Microsoft.EntityFrameworkCore;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Persistence.Extensions;

namespace Nory.Infrastructure.Persistence.Repositories;

public class AttendeeRepository : IAttendeeRepository
{
    private readonly ApplicationDbContext _context;

    public AttendeeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Attendee?> GetByIdAsync(Guid attendeeId, CancellationToken cancellationToken = default)
    {
        var dbModel = await _context.Attendees
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == attendeeId && a.DeletedAt == null, cancellationToken);

        return dbModel?.MapToDomain();
    }

    public async Task<Attendee?> GetByEventAndIdAsync(Guid eventId, Guid attendeeId, CancellationToken cancellationToken = default)
    {
        var dbModel = await _context.Attendees
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.EventId == eventId && a.Id == attendeeId && a.DeletedAt == null, cancellationToken);

        return dbModel?.MapToDomain();
    }

    public async Task<IReadOnlyList<Attendee>> GetByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        var dbModels = await _context.Attendees
            .Where(a => a.EventId == eventId && a.DeletedAt == null)
            .OrderByDescending(a => a.CreatedAt)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return dbModels.MapToDomain();
    }

    public async Task<int> CountByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        return await _context.Attendees
            .CountAsync(a => a.EventId == eventId && a.DeletedAt == null, cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid attendeeId, CancellationToken cancellationToken = default)
    {
        return await _context.Attendees
            .AnyAsync(a => a.Id == attendeeId && a.DeletedAt == null, cancellationToken);
    }

    public void Add(Attendee attendee)
    {
        var dbModel = attendee.MapToDbModel();
        _context.Attendees.Add(dbModel);
    }

    public void Update(Attendee attendee)
    {
        var dbModel = attendee.MapToDbModel();
        _context.Attendees.Update(dbModel);
    }

    public void Remove(Attendee attendee)
    {
        var dbModel = attendee.MapToDbModel();
        _context.Attendees.Remove(dbModel);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}
