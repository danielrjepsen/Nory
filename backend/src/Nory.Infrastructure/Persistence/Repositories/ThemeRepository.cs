using Microsoft.EntityFrameworkCore;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Persistence.Extensions;

namespace Nory.Infrastructure.Persistence.Repositories;

public class ThemeRepository : IThemeRepository
{
    private readonly ApplicationDbContext _context;

    public ThemeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Theme>> GetAllActiveAsync(CancellationToken cancellationToken = default)
    {
        var dbModels = await _context.Themes
            .Where(t => t.IsActive)
            .OrderBy(t => t.SortOrder)
            .ThenBy(t => t.DisplayName)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return dbModels.MapToDomain();
    }

    public async Task<Theme?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var dbModel = await _context.Themes
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

        return dbModel?.MapToDomain();
    }

    public async Task<Theme?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        var dbModel = await _context.Themes
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Name.ToLower() == name.ToLower(), cancellationToken);

        return dbModel?.MapToDomain();
    }

    public async Task<bool> ExistsAsync(string name, CancellationToken cancellationToken = default)
    {
        return await _context.Themes
            .AnyAsync(t => t.Name.ToLower() == name.ToLower(), cancellationToken);
    }

    public void Add(Theme theme)
    {
        var dbModel = theme.MapToDbModel();
        _context.Themes.Add(dbModel);
    }

    public void AddRange(IEnumerable<Theme> themes)
    {
        var dbModels = themes.Select(t => t.MapToDbModel());
        _context.Themes.AddRange(dbModels);
    }

    public void Update(Theme theme)
    {
        var dbModel = theme.MapToDbModel();
        _context.Themes.Update(dbModel);
    }

    public void Remove(Theme theme)
    {
        var dbModel = theme.MapToDbModel();
        _context.Themes.Remove(dbModel);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}
