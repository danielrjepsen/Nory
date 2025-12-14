using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nory.Application.DTOs.Themes;
using Nory.Application.Services;

namespace Nory.Api.Controllers;

[Route("api/v1/themes")]
public class ThemesController(IThemeService themeService) : ApiControllerBase
{
    [HttpGet("presets")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ThemePresetsResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetThemePresets(CancellationToken cancellationToken)
    {
        var result = await themeService.GetActiveThemePresetsAsync(cancellationToken);
        return ToActionResult(result);
    }

    [HttpGet("{name}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ThemeResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetThemeByName(string name, CancellationToken cancellationToken)
    {
        var result = await themeService.GetThemeByNameAsync(name, cancellationToken);
        if (!result.IsSuccess)
            return ToActionResult(result);

        return Ok(new ThemeResponse(true, result.Data!));
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ThemeResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CreateTheme([FromBody] CreateThemeDto request, CancellationToken cancellationToken)
    {
        var result = await themeService.CreateThemeAsync(request, cancellationToken);
        if (!result.IsSuccess)
            return ToActionResult(result);

        return CreatedAtAction(
            nameof(GetThemeByName),
            new { name = result.Data!.Name },
            new ThemeResponse(true, result.Data!, "Theme created successfully"));
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(ThemeResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateTheme(Guid id, [FromBody] UpdateThemeDto request, CancellationToken cancellationToken)
    {
        var result = await themeService.UpdateThemeAsync(id, request, cancellationToken);
        if (!result.IsSuccess)
            return ToActionResult(result);

        return Ok(new ThemeResponse(true, result.Data!, "Theme updated successfully"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteTheme(Guid id, CancellationToken cancellationToken)
    {
        var result = await themeService.DeleteThemeAsync(id, cancellationToken);
        if (!result.IsSuccess)
            return ToActionResult(result);

        return Ok(new { success = true, message = "Theme deleted successfully" });
    }
}
