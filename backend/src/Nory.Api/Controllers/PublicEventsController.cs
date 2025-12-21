using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nory.Application.DTOs;
using Nory.Application.Services;

namespace Nory.Api.Controllers;

[Route("api/v1/events")]
[AllowAnonymous]
public class PublicEventsController(
    IPublicEventService publicEventService,
    IPhotoService photoService
) : ApiControllerBase
{
    [HttpGet("public")]
    [ProducesResponseType(typeof(PublicEventsResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPublicEvents(CancellationToken cancellationToken)
    {
        var result = await publicEventService.GetPublicEventsAsync(cancellationToken);
        return ToActionResult(result);
    }

    [HttpGet("{eventId:guid}/photos")]
    [ProducesResponseType(typeof(PublicPhotosResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status410Gone)]
    public async Task<IActionResult> GetPhotos(
        Guid eventId,
        [FromQuery] Guid? categoryId = null,
        [FromQuery] int limit = 100,
        [FromQuery] int offset = 0,
        [FromQuery] bool preview = false,
        CancellationToken cancellationToken = default)
    {
        var query = new GetPhotosQuery(categoryId, limit, offset, preview);
        var result = await publicEventService.GetPhotosAsync(eventId, query, cancellationToken);
        return ToActionResult(result);
    }

    [HttpPost("{eventId:guid}/photos")]
    [RequestSizeLimit(1024 * 1024 * 1024)]
    [RequestFormLimits(MultipartBodyLengthLimit = 1024 * 1024 * 1024)]
    [ProducesResponseType(typeof(UploadPhotosResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UploadPhotos(Guid eventId, CancellationToken cancellationToken)
    {
        var files = Request.Form.Files;
        var userName = Request.Form["userName"].FirstOrDefault();
        var categoryIdStr = Request.Form["categoryId"].FirstOrDefault();

        Guid? categoryId = null;
        if (!string.IsNullOrEmpty(categoryIdStr) && Guid.TryParse(categoryIdStr, out var parsedCategoryId))
        {
            categoryId = parsedCategoryId;
        }

        if (files.Count == 0)
        {
            return BadRequest(new { success = false, error = "No files uploaded" });
        }

        var uploadCommands = new List<UploadPhotoCommand>();
        foreach (var file in files)
        {
            uploadCommands.Add(new UploadPhotoCommand(
                file.OpenReadStream(),
                file.FileName,
                file.ContentType,
                file.Length,
                userName,
                categoryId
            ));
        }

        var result = await photoService.UploadPhotosAsync(eventId, uploadCommands, cancellationToken);
        return ToActionResult(result);
    }

    [HttpGet("{eventId:guid}/photos/{photoId:guid}/image")]
    [ProducesResponseType(typeof(FileStreamResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ResponseCache(Duration = 86400, Location = ResponseCacheLocation.Any)]
    public async Task<IActionResult> GetPhotoImage(
        Guid eventId,
        Guid photoId,
        CancellationToken cancellationToken)
    {
        var result = await publicEventService.GetPhotoImageAsync(eventId, photoId, cancellationToken);

        if (!result.IsSuccess)
            return NotFound();

        return File(result.Data!.FileStream, result.Data.ContentType, enableRangeProcessing: true);
    }

    [HttpGet("{eventId:guid}/photos/categories")]
    [ProducesResponseType(typeof(PublicCategoriesResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCategories(Guid eventId, CancellationToken cancellationToken)
    {
        var result = await publicEventService.GetCategoriesAsync(eventId, cancellationToken);
        return ToActionResult(result);
    }

    [HttpGet("public/{eventId:guid}/template")]
    [ProducesResponseType(typeof(TemplateResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTemplate(Guid eventId, CancellationToken cancellationToken)
    {
        var result = await publicEventService.GetTemplateAsync(eventId, cancellationToken);
        return ToActionResult(result);
    }
}
