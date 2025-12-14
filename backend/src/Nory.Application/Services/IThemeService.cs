using Nory.Application.Common;
using Nory.Application.DTOs.Themes;

namespace Nory.Application.Services;

public interface IThemeService
{
    Task<Result<ThemePresetsResponse>> GetActiveThemePresetsAsync(
        CancellationToken cancellationToken = default);

    Task<Result<ThemeDto>> GetThemeByNameAsync(
        string name,
        CancellationToken cancellationToken = default);

    Task<Result<ThemeDto>> GetThemeByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<Result<ThemeDto>> CreateThemeAsync(
        CreateThemeDto dto,
        CancellationToken cancellationToken = default);

    Task<Result<ThemeDto>> UpdateThemeAsync(
        Guid id,
        UpdateThemeDto dto,
        CancellationToken cancellationToken = default);

    Task<Result> DeleteThemeAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}
