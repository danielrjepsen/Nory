using Nory.Core.Domain.Entities;

namespace Nory.Core.Domain.Repositories;

public interface IEmailConfigurationRepository
{
    Task<EmailConfiguration?> GetAsync(CancellationToken cancellationToken = default);
    Task SaveAsync(EmailConfiguration configuration, CancellationToken cancellationToken = default);
    Task DeleteAsync(CancellationToken cancellationToken = default);
}
