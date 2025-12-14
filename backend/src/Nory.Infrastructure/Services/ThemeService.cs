using Microsoft.Extensions.Logging;
using Nory.Application.Common;
using Nory.Application.DTOs.Themes;
using Nory.Application.Extensions;
using Nory.Application.Services;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Repositories;

namespace Nory.Infrastructure.Services;

public class ThemeService : IThemeService
{
    private readonly IThemeRepository _themeRepository;
    private readonly ILogger<ThemeService> _logger;

    public ThemeService(IThemeRepository themeRepository, ILogger<ThemeService> logger)
    {
        _themeRepository = themeRepository;
        _logger = logger;
    }

    public async Task<Result<ThemePresetsResponse>> GetActiveThemePresetsAsync(
        CancellationToken cancellationToken = default)
    {
        var themes = await _themeRepository.GetAllActiveAsync(cancellationToken);
        var presets = themes.MapToPresetDto();
        return Result<ThemePresetsResponse>.Success(new ThemePresetsResponse(true, presets));
    }

    public async Task<Result<ThemeDto>> GetThemeByNameAsync(
        string name,
        CancellationToken cancellationToken = default)
    {
        var theme = await _themeRepository.GetByNameAsync(name, cancellationToken);

        if (theme is null)
        {
            return Result<ThemeDto>.NotFound("Theme not found");
        }

        return Result<ThemeDto>.Success(theme.MapToDto());
    }

    public async Task<Result<ThemeDto>> GetThemeByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var theme = await _themeRepository.GetByIdAsync(id, cancellationToken);

        if (theme is null)
        {
            return Result<ThemeDto>.NotFound("Theme not found");
        }

        return Result<ThemeDto>.Success(theme.MapToDto());
    }

    public async Task<Result<ThemeDto>> CreateThemeAsync(
        CreateThemeDto dto,
        CancellationToken cancellationToken = default)
    {
        if (await _themeRepository.ExistsAsync(dto.Name, cancellationToken))
        {
            return Result<ThemeDto>.BadRequest("Theme name already exists");
        }

        var theme = Theme.Create(
            name: dto.Name,
            displayName: dto.DisplayName,
            primaryColor: dto.PrimaryColor,
            secondaryColor: dto.SecondaryColor,
            accentColor: dto.AccentColor,
            description: dto.Description,
            backgroundColor1: dto.BackgroundColor1,
            backgroundColor2: dto.BackgroundColor2,
            backgroundColor3: dto.BackgroundColor3,
            textPrimary: dto.TextPrimary,
            textSecondary: dto.TextSecondary,
            textAccent: dto.TextAccent,
            primaryFont: dto.PrimaryFont,
            secondaryFont: dto.SecondaryFont,
            themeConfig: dto.ThemeConfig,
            darkBackgroundGradient: dto.DarkBackgroundGradient,
            darkParticleColors: dto.DarkParticleColors,
            sortOrder: dto.SortOrder ?? 999
        );

        _themeRepository.Add(theme);
        await _themeRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created new theme: {ThemeName} ({ThemeId})", theme.Name, theme.Id);
        return Result<ThemeDto>.Success(theme.MapToDto());
    }

    public async Task<Result<ThemeDto>> UpdateThemeAsync(
        Guid id,
        UpdateThemeDto dto,
        CancellationToken cancellationToken = default)
    {
        var theme = await _themeRepository.GetByIdAsync(id, cancellationToken);

        if (theme is null)
        {
            return Result<ThemeDto>.NotFound("Theme not found");
        }

        if (theme.IsSystemTheme && !dto.AllowSystemThemeModification)
        {
            return Result<ThemeDto>.BadRequest("Cannot modify system themes");
        }

        theme.Update(
            displayName: dto.DisplayName,
            primaryColor: dto.PrimaryColor,
            secondaryColor: dto.SecondaryColor,
            accentColor: dto.AccentColor,
            description: dto.Description,
            backgroundColor1: dto.BackgroundColor1,
            backgroundColor2: dto.BackgroundColor2,
            backgroundColor3: dto.BackgroundColor3,
            textPrimary: dto.TextPrimary,
            textSecondary: dto.TextSecondary,
            textAccent: dto.TextAccent,
            primaryFont: dto.PrimaryFont,
            secondaryFont: dto.SecondaryFont,
            themeConfig: dto.ThemeConfig,
            darkBackgroundGradient: dto.DarkBackgroundGradient,
            darkParticleColors: dto.DarkParticleColors,
            isActive: dto.IsActive,
            sortOrder: dto.SortOrder
        );

        _themeRepository.Update(theme);
        await _themeRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated theme: {ThemeName} ({ThemeId})", theme.Name, theme.Id);
        return Result<ThemeDto>.Success(theme.MapToDto());
    }

    public async Task<Result> DeleteThemeAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var theme = await _themeRepository.GetByIdAsync(id, cancellationToken);

        if (theme is null)
        {
            return Result.NotFound("Theme not found");
        }

        if (theme.IsSystemTheme)
        {
            return Result.BadRequest("Cannot delete system themes");
        }

        _themeRepository.Remove(theme);
        await _themeRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted theme: {ThemeName} ({ThemeId})", theme.Name, theme.Id);
        return Result.Success();
    }
}
