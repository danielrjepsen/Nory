using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Nory.Application.Common;
using Nory.Application.DTOs;
using Nory.Application.Services;
using Nory.Core.Domain.Enums;
using Nory.Infrastructure.Persistence;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Services;

public class PhotoService : IPhotoService
{
    private readonly ApplicationDbContext _context;
    private readonly IFileStorageService _fileStorage;
    private readonly ILogger<PhotoService> _logger;

    public PhotoService(
        ApplicationDbContext context,
        IFileStorageService fileStorage,
        ILogger<PhotoService> logger)
    {
        _context = context;
        _fileStorage = fileStorage;
        _logger = logger;
    }

    public async Task<Result<PhotosResponse>> GetPhotosForDashboardAsync(
        Guid eventId,
        string userId,
        Guid? categoryId = null,
        int limit = 50,
        int offset = 0,
        CancellationToken cancellationToken = default)
    {
        var eventEntity = await _context.Events
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == eventId && e.UserId == userId, cancellationToken);

        if (eventEntity is null)
        {
            return Result<PhotosResponse>.NotFound("Event not found");
        }

        if (eventEntity.Status == EventStatus.Archived)
        {
            return Result<PhotosResponse>.NotFound("Event has been archived");
        }

        var query = _context.EventPhotos.AsNoTracking().Where(p => p.EventId == eventId);

        if (categoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == categoryId.Value);
        }

        var photos = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip(offset)
            .Take(Math.Min(limit, 100))
            .Select(p => new PhotoDto(
                p.Id,
                $"/api/v1/events/{eventId}/photos/{p.Id}/secure",
                p.OriginalFileName,
                p.UploadedBy ?? "Anonymous",
                p.CategoryId,
                p.Width,
                p.Height,
                p.FileSizeBytes,
                p.CreatedAt
            ))
            .ToListAsync(cancellationToken);

        _logger.LogInformation("Retrieved {Count} photos for event {EventId}", photos.Count, eventId);

        return Result<PhotosResponse>.Success(
            new PhotosResponse(true, photos, photos.Count));
    }

    public async Task<Result<UploadPhotosResponse>> UploadPhotosAsync(
        Guid eventId,
        IReadOnlyList<UploadPhotoCommand> files,
        CancellationToken cancellationToken = default)
    {
        if (files.Count == 0)
        {
            return Result<UploadPhotosResponse>.BadRequest("No files uploaded");
        }

        var eventEntity = await _context.Events
            .FirstOrDefaultAsync(e => e.Id == eventId, cancellationToken);

        if (eventEntity is null)
        {
            return Result<UploadPhotosResponse>.NotFound("Event not found");
        }

        if (eventEntity.Status == EventStatus.Archived)
        {
            return Result<UploadPhotosResponse>.BadRequest("This event no longer accepts photo uploads");
        }

        var uploadedPhotos = new List<UploadedPhotoDto>();
        var userName = files.FirstOrDefault()?.UserName ?? "Anonymous";

        foreach (var file in files)
        {
            try
            {
                var storageResult = await _fileStorage.StoreFileAsync(
                    file.FileStream,
                    file.FileName,
                    file.ContentType,
                    eventId,
                    eventEntity.Name,
                    "events",
                    cancellationToken
                );

                if (!storageResult.Success)
                {
                    _logger.LogWarning("Failed to store file {FileName}: {Error}",
                        file.FileName, storageResult.ErrorMessage);
                    continue;
                }

                var photoId = Guid.NewGuid();
                var imageUrl = $"/api/v1/events/{eventId}/photos/{photoId}/image";

                var photo = new EventPhotoDbModel
                {
                    Id = photoId,
                    EventId = eventId,
                    CategoryId = file.CategoryId,
                    FileName = Path.GetFileName(storageResult.StoragePath),
                    OriginalFileName = file.FileName,
                    ContentType = file.ContentType,
                    FileSizeBytes = file.FileSize,
                    StoragePath = storageResult.StoragePath,
                    ImageUrl = imageUrl,
                    UploadedBy = file.UserName ?? "Anonymous",
                    Year = DateTime.UtcNow.Year,
                    CreatedAt = DateTime.UtcNow,
                };

                _context.EventPhotos.Add(photo);

                if (!eventEntity.HasContent)
                {
                    eventEntity.HasContent = true;
                }

                uploadedPhotos.Add(new UploadedPhotoDto(photo.Id, file.FileName, imageUrl));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to process file {FileName}", file.FileName);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Uploaded {Count} photos for event {EventId}", uploadedPhotos.Count, eventId);

        return Result<UploadPhotosResponse>.Success(new UploadPhotosResponse(
            true,
            $"Successfully uploaded {uploadedPhotos.Count} of {files.Count} photos",
            uploadedPhotos,
            userName
        ));
    }

    public async Task<Result> MovePhotoToCategoryAsync(
        Guid eventId,
        Guid photoId,
        string userId,
        MovePhotoCategoryCommand command,
        CancellationToken cancellationToken = default)
    {
        var photo = await _context.EventPhotos
            .Include(p => p.Event)
            .FirstOrDefaultAsync(p => p.Id == photoId && p.EventId == eventId, cancellationToken);

        if (photo?.Event is null || photo.Event.UserId != userId)
        {
            return Result.NotFound("Photo not found");
        }

        if (command.CategoryId.HasValue)
        {
            var categoryExists = await _context.EventCategories
                .AnyAsync(c => c.Id == command.CategoryId && c.EventId == eventId, cancellationToken);

            if (!categoryExists)
            {
                return Result.BadRequest("Category not found");
            }
        }

        photo.CategoryId = command.CategoryId;
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Moved photo {PhotoId} to category {CategoryId}", photoId, command.CategoryId);

        return Result.Success();
    }

    public async Task<Result> DeletePhotoAsync(
        Guid eventId,
        Guid photoId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var photo = await _context.EventPhotos
            .Include(p => p.Event)
            .FirstOrDefaultAsync(p => p.Id == photoId && p.EventId == eventId, cancellationToken);

        if (photo?.Event is null || photo.Event.UserId != userId)
        {
            return Result.NotFound("Photo not found");
        }

        if (!string.IsNullOrEmpty(photo.StoragePath))
        {
            await _fileStorage.DeleteFileAsync(photo.StoragePath, cancellationToken);
        }

        _context.EventPhotos.Remove(photo);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted photo {PhotoId}", photoId);

        return Result.Success();
    }

    public async Task<Result<FileResult>> GetPhotoImageAsync(
        Guid eventId,
        Guid photoId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var photo = await _context.EventPhotos
            .AsNoTracking()
            .Include(p => p.Event)
            .FirstOrDefaultAsync(p => p.Id == photoId && p.EventId == eventId, cancellationToken);

        if (photo?.Event is null || photo.Event.UserId != userId)
        {
            return Result<FileResult>.NotFound("Photo not found");
        }

        if (string.IsNullOrEmpty(photo.StoragePath))
        {
            _logger.LogWarning("Photo {PhotoId} has no storage path", photoId);
            return Result<FileResult>.NotFound("Photo not found");
        }

        var fileResult = await _fileStorage.GetFileAsync(photo.StoragePath, cancellationToken);
        if (fileResult is null)
        {
            _logger.LogWarning("File not found for photo {PhotoId}: {Path}", photoId, photo.StoragePath);
            return Result<FileResult>.NotFound("Photo not found");
        }

        return Result<FileResult>.Success(new FileResult(fileResult.FileStream, fileResult.ContentType));
    }
}
