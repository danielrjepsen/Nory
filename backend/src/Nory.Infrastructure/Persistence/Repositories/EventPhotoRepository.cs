using Microsoft.EntityFrameworkCore;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Persistence.Extensions;

namespace Nory.Infrastructure.Persistence.Repositories;

public class EventPhotoRepository : IEventPhotoRepository
{
    private readonly ApplicationDbContext _context;

    public EventPhotoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<EventPhoto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var dbModel = await _context.EventPhotos
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        return dbModel?.MapToDomain();
    }

    public async Task<EventPhoto?> GetByIdWithEventAsync(Guid id, Guid eventId, CancellationToken cancellationToken = default)
    {
        var dbModel = await _context.EventPhotos
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id && p.EventId == eventId, cancellationToken);

        return dbModel?.MapToDomain();
    }

    public async Task<IReadOnlyList<EventPhoto>> GetByEventIdAsync(
        Guid eventId,
        Guid? categoryId = null,
        int limit = 50,
        int offset = 0,
        CancellationToken cancellationToken = default)
    {
        var query = _context.EventPhotos
            .AsNoTracking()
            .Where(p => p.EventId == eventId);

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        var dbModels = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip(offset)
            .Take(Math.Min(limit, 100))
            .ToListAsync(cancellationToken);

        return dbModels.MapToDomain();
    }

    public void Add(EventPhoto photo)
    {
        var dbModel = photo.MapToDbModel();
        _context.EventPhotos.Add(dbModel);
    }

    public void AddRange(IEnumerable<EventPhoto> photos)
    {
        var dbModels = photos.Select(p => p.MapToDbModel());
        _context.EventPhotos.AddRange(dbModels);
    }

    public void Update(EventPhoto photo)
    {
        var dbModel = _context.EventPhotos.Local.FirstOrDefault(p => p.Id == photo.Id);
        if (dbModel != null)
        {
            dbModel.UpdateFrom(photo);
        }
        else
        {
            dbModel = photo.MapToDbModel();
            _context.EventPhotos.Attach(dbModel);
            _context.Entry(dbModel).State = EntityState.Modified;
        }
    }

    public void Remove(EventPhoto photo)
    {
        var dbModel = _context.EventPhotos.Local.FirstOrDefault(p => p.Id == photo.Id);
        if (dbModel != null)
        {
            _context.EventPhotos.Remove(dbModel);
        }
        else
        {
            dbModel = new EventPhotoDbModel { Id = photo.Id };
            _context.EventPhotos.Attach(dbModel);
            _context.EventPhotos.Remove(dbModel);
        }
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
