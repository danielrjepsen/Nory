using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nory.Api.Requests;
using Nory.Application.DTOs;
using Nory.Application.Services;

namespace Nory.Api.Controllers;

[Route("api/v1/events/{eventId:guid}/photos")]
[Authorize]
public class EventPhotosController(IPhotoService photoService) : ApiControllerBase
{
    [HttpGet("dashboard")]
    [ProducesResponseType(typeof(PhotosResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetPhotosForDashboard(
        Guid eventId,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] int limit = 50,
        [FromQuery] int offset = 0,
        CancellationToken cancellationToken = default)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await photoService.GetPhotosForDashboardAsync(
            eventId, userId, categoryId, limit, offset, cancellationToken);

        return ToActionResult(result);
    }

    [HttpPatch("{photoId:guid}/category")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MovePhotoToCategory(
        Guid eventId,
        Guid photoId,
        [FromBody] MoveCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var command = new MovePhotoCategoryCommand(request.CategoryId);
        var result = await photoService.MovePhotoToCategoryAsync(
            eventId, photoId, userId, command, cancellationToken);

        if (!result.IsSuccess)
            return ToActionResult(result);

        return Ok(new { success = true, message = "Photo moved successfully" });
    }

    [HttpDelete("{photoId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeletePhoto(
        Guid eventId,
        Guid photoId,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await photoService.DeletePhotoAsync(eventId, photoId, userId, cancellationToken);

        if (!result.IsSuccess)
            return ToActionResult(result);

        return NoContent();
    }

    [HttpGet("{photoId:guid}/secure")]
    [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ResponseCache(Duration = 86400, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetPhotoImage(
        Guid eventId,
        Guid photoId,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await photoService.GetPhotoImageAsync(eventId, photoId, userId, cancellationToken);

        if (!result.IsSuccess)
            return NotFound();

        return File(result.Data!.FileStream, result.Data.ContentType, enableRangeProcessing: true);
    }
}
