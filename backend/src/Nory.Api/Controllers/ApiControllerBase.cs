using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Nory.Application.Common;

namespace Nory.Api.Controllers;

/// <summary>
/// Base controller
/// </summary>
[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    protected string? GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    protected IActionResult ToActionResult<T>(Result<T> result)
    {
        if (result.IsSuccess)
            return Ok(result.Data);

        return result.ErrorType switch
        {
            ResultErrorType.NotFound => NotFound(new { success = false, error = result.Error }),
            ResultErrorType.BadRequest => BadRequest(new { success = false, error = result.Error }),
            ResultErrorType.Unauthorized => Unauthorized(
                new { success = false, error = result.Error }
            ),
            _ => BadRequest(new { success = false, error = result.Error }),
        };
    }

    protected IActionResult ToActionResult(Result result)
    {
        if (result.IsSuccess)
            return Ok(new { success = true });

        return result.ErrorType switch
        {
            ResultErrorType.NotFound => NotFound(new { success = false, error = result.Error }),
            ResultErrorType.BadRequest => BadRequest(new { success = false, error = result.Error }),
            ResultErrorType.Unauthorized => Unauthorized(
                new { success = false, error = result.Error }
            ),
            _ => BadRequest(new { success = false, error = result.Error }),
        };
    }
}
