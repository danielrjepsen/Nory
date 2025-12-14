using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nory.Api.Requests;
using Nory.Application.DTOs;
using Nory.Application.Services;

namespace Nory.Api.Controllers;

[Route("api/v1/events/{eventId:guid}/categories")]
[Authorize]
public class EventCategoriesController(ICategoryService categoryService) : ApiControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(CategoriesResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCategories(Guid eventId, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await categoryService.GetCategoriesAsync(eventId, userId, cancellationToken);
        return ToActionResult(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(CategoryResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CreateCategory(
        Guid eventId,
        [FromBody] CreateCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var command = new CreateCategoryCommand(request.Name, request.Description, request.SortOrder);
        var result = await categoryService.CreateCategoryAsync(eventId, userId, command, cancellationToken);

        if (!result.IsSuccess)
            return ToActionResult(result);

        return CreatedAtAction(
            nameof(GetCategories),
            new { eventId },
            new CategoryResponse(true, result.Data!));
    }

    [HttpPut("{categoryId:guid}")]
    [ProducesResponseType(typeof(CategoryResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateCategory(
        Guid eventId,
        Guid categoryId,
        [FromBody] UpdateCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var command = new UpdateCategoryCommand(request.Name, request.Description, request.SortOrder);
        var result = await categoryService.UpdateCategoryAsync(eventId, categoryId, userId, command, cancellationToken);

        if (!result.IsSuccess)
            return ToActionResult(result);

        return Ok(new CategoryResponse(true, result.Data!));
    }

    [HttpDelete("{categoryId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCategory(
        Guid eventId,
        Guid categoryId,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var result = await categoryService.DeleteCategoryAsync(eventId, categoryId, userId, cancellationToken);

        if (!result.IsSuccess)
            return ToActionResult(result);

        return Ok(new { success = true, message = "Category deleted successfully" });
    }

    [HttpPost("reorder")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ReorderCategories(
        Guid eventId,
        [FromBody] ReorderCategoriesRequest request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var command = new ReorderCategoriesCommand(request.CategoryIds);
        var result = await categoryService.ReorderCategoriesAsync(eventId, userId, command, cancellationToken);

        if (!result.IsSuccess)
            return ToActionResult(result);

        return Ok(new { success = true, message = "Categories reordered successfully" });
    }
}
