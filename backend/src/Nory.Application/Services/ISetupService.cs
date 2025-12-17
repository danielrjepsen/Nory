using Nory.Application.DTOs.Setup;

namespace Nory.Application.Services;

public interface ISetupService
{
    Task<SetupStatusDto> GetStatusAsync();
    Task<SetupResult> CompleteSetupAsync(CompleteSetupRequest request);
}
