using Microsoft.EntityFrameworkCore;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Persistence.Extensions;

namespace Nory.Infrastructure.Persistence.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly ApplicationDbContext _context;

    public CategoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<EventCategory>> GetByEventIdAsync(Guid eventId, CancellationToken cancellationToken = default)
    {
        var dbModels = await _context.EventCategories
            .Include(c => c.Photos)
            .Where(c => c.EventId == eventId)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return dbModels.MapToDomain();
    }

    public async Task<EventCategory?> GetByIdAsync(Guid categoryId, Guid eventId, CancellationToken cancellationToken = default)
    {
        var dbModel = await _context.EventCategories
            .Include(c => c.Event)
            .Include(c => c.Photos)
            .FirstOrDefaultAsync(c => c.Id == categoryId && c.EventId == eventId, cancellationToken);

        return dbModel?.MapToDomain();
    }

    public async Task<bool> NameExistsAsync(Guid eventId, string name, Guid? excludeCategoryId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.EventCategories
            .Where(c => c.EventId == eventId && c.Name == name);

        if (excludeCategoryId.HasValue)
            query = query.Where(c => c.Id != excludeCategoryId.Value);

        return await query.AnyAsync(cancellationToken);
    }

    public void Add(EventCategory category)
    {
        var dbModel = category.MapToDbModel();
        _context.EventCategories.Add(dbModel);
    }

    public void Update(EventCategory category)
    {
        var dbModel = _context.EventCategories.Local
            .FirstOrDefault(c => c.Id == category.Id);

        if (dbModel != null)
        {
            dbModel.UpdateFrom(category);
        }
        else
        {
            dbModel = category.MapToDbModel();
            _context.EventCategories.Update(dbModel);
        }
    }

    public void Remove(EventCategory category)
    {
        var dbModel = _context.EventCategories.Local
            .FirstOrDefault(c => c.Id == category.Id);

        if (dbModel != null)
        {
            _context.EventCategories.Remove(dbModel);
        }
        else
        {
            dbModel = category.MapToDbModel();
            _context.EventCategories.Attach(dbModel);
            _context.EventCategories.Remove(dbModel);
        }
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}
