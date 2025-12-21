using Microsoft.EntityFrameworkCore;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;
using Nory.Infrastructure.Persistence.Extensions;

namespace Nory.Infrastructure.Persistence.Repositories;

public class EmailConfigurationRepository : IEmailConfigurationRepository
{
    private readonly ApplicationDbContext _context;

    public EmailConfigurationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<EmailConfiguration?> GetAsync(CancellationToken cancellationToken = default)
    {
        var model = await _context.EmailConfigurations
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);

        return model?.ToDomain();
    }

    public async Task SaveAsync(EmailConfiguration configuration, CancellationToken cancellationToken = default)
    {
        var existing = await _context.EmailConfigurations
            .FirstOrDefaultAsync(cancellationToken);

        if (existing != null)
        {
            existing.UpdateFrom(configuration);
        }
        else
        {
            _context.EmailConfigurations.Add(configuration.ToDbModel());
        }

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(CancellationToken cancellationToken = default)
    {
        var existing = await _context.EmailConfigurations
            .FirstOrDefaultAsync(cancellationToken);

        if (existing != null)
        {
            _context.EmailConfigurations.Remove(existing);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
