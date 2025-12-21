using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nory.Application.DTOs.Backup;
using Nory.Application.Services;
using Nory.Core.Domain.Enums;

namespace Nory.Api.Controllers;

[Route("api/v1/backup")]
[Authorize]
public class BackupController(IBackupService backupService) : ApiControllerBase
{
    private const int MaxServiceAccountFileSize = 100 * 1024; // 100KB
    private const int MaxHistoryLimit = 100;

    [HttpGet("config")]
    [ProducesResponseType(typeof(BackupConfigurationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetConfiguration(CancellationToken cancellationToken)
    {
        var result = await backupService.GetConfigurationAsync(cancellationToken);
        return ToActionResult(result);
    }

    [HttpPost("config")]
    [ProducesResponseType(typeof(BackupConfigurationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [RequestSizeLimit(MaxServiceAccountFileSize)]
    public async Task<IActionResult> Configure(
        [FromForm] ConfigureBackupRequest request,
        CancellationToken cancellationToken
    )
    {
        if (request.ServiceAccountFile is null || request.ServiceAccountFile.Length == 0)
        {
            return BadRequest(new { success = false, error = "Service account file is required" });
        }

        if (request.ServiceAccountFile.Length > MaxServiceAccountFileSize)
        {
            return BadRequest(
                new { success = false, error = "Service account file is too large (max 100KB)" }
            );
        }

        var fileName = request.ServiceAccountFile.FileName;
        if (
            !string.IsNullOrEmpty(fileName)
            && !fileName.EndsWith(".json", StringComparison.OrdinalIgnoreCase)
        )
        {
            return BadRequest(
                new { success = false, error = "Service account file must be a JSON file" }
            );
        }

        if (string.IsNullOrWhiteSpace(request.FolderName))
        {
            return BadRequest(new { success = false, error = "Folder name is required" });
        }

        if (request.FolderName.Length > 200)
        {
            return BadRequest(
                new { success = false, error = "Folder name cannot exceed 200 characters" }
            );
        }

        using var reader = new StreamReader(request.ServiceAccountFile.OpenReadStream());
        var serviceAccountJson = await reader.ReadToEndAsync(cancellationToken);

        var trimmedJson = serviceAccountJson.Trim();
        if (!trimmedJson.StartsWith('{') || !trimmedJson.EndsWith('}'))
        {
            return BadRequest(new { success = false, error = "Invalid JSON file format" });
        }

        var command = new ConfigureBackupCommand(
            BackupProvider.GoogleDrive,
            request.Schedule,
            request.FolderName.Trim(),
            serviceAccountJson
        );

        var result = await backupService.ConfigureAsync(command, cancellationToken);

        if (!result.IsSuccess)
            return ToActionResult(result);

        return CreatedAtAction(nameof(GetConfiguration), result.Data);
    }

    [HttpPut("config")]
    [ProducesResponseType(typeof(BackupConfigurationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateConfiguration(
        [FromBody] UpdateBackupRequest request,
        CancellationToken cancellationToken
    )
    {
        if (request.FolderName is not null)
        {
            if (string.IsNullOrWhiteSpace(request.FolderName))
            {
                return BadRequest(new { success = false, error = "Folder name cannot be empty" });
            }

            if (request.FolderName.Length > 200)
            {
                return BadRequest(
                    new { success = false, error = "Folder name cannot exceed 200 characters" }
                );
            }
        }

        var command = new UpdateBackupCommand(request.Schedule, request.FolderName?.Trim());
        var result = await backupService.UpdateConfigurationAsync(command, cancellationToken);
        return ToActionResult(result);
    }

    [HttpDelete("config")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteConfiguration(CancellationToken cancellationToken)
    {
        var result = await backupService.DisableAsync(cancellationToken);
        return ToActionResult(result);
    }

    [HttpPost("test")]
    [ProducesResponseType(typeof(TestConnectionResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> TestConnection(CancellationToken cancellationToken)
    {
        var result = await backupService.TestConnectionAsync(cancellationToken);
        return ToActionResult(result);
    }

    [HttpPost("run")]
    [ProducesResponseType(typeof(BackupRunResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RunBackup(CancellationToken cancellationToken)
    {
        var result = await backupService.RunBackupAsync(cancellationToken);
        return ToActionResult(result);
    }

    [HttpGet("history")]
    [ProducesResponseType(typeof(IReadOnlyList<BackupHistoryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHistory(
        [FromQuery] int limit = 10,
        CancellationToken cancellationToken = default
    )
    {
        // Constrain limit to prevent excessive queries
        var safeLimit = Math.Clamp(limit, 1, MaxHistoryLimit);
        var result = await backupService.GetHistoryAsync(safeLimit, cancellationToken);
        return ToActionResult(result);
    }
}

public record ConfigureBackupRequest(
    BackupSchedule Schedule,
    string FolderName,
    IFormFile? ServiceAccountFile
);

public record UpdateBackupRequest(BackupSchedule? Schedule, string? FolderName);
