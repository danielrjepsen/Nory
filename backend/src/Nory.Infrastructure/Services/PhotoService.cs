using Microsoft.Extensions.Logging;
using Nory.Application.Common;
using Nory.Application.DTOs;
using Nory.Application.Services;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Enums;
using Nory.Core.Domain.Repositories;

namespace Nory.Infrastructure.Services;

public class PhotoService : IPhotoService
{
    private readonly IEventRepository _eventRepository;
    private readonly IEventPhotoRepository _photoRepository;
    private readonly IFileStorageService _fileStorage;
    private readonly ILogger<PhotoService> _logger;

    public PhotoService(
        IEventRepository eventRepository,
        IEventPhotoRepository photoRepository,
        IFileStorageService fileStorage,
        ILogger<PhotoService> logger)
    {
        _eventRepository = eventRepository;
        _photoRepository = photoRepository;
        _fileStorage = fileStorage;
        _logger = logger;
    }

    public async Task<Result<PhotosResponse>> GetPhotosForDashboardAsync(
        Guid eventId,
        Guid? categoryId = null,
        int limit = 50,
        int offset = 0,
        CancellationToken cancellationToken = default)
    {
        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken);

        if (eventEntity is null)
            return Result<PhotosResponse>.NotFound("Event not found");

        if (eventEntity.Status == EventStatus.Archived)
            return Result<PhotosResponse>.NotFound("Event has been archived");

        var photos = await _photoRepository.GetByEventIdAsync(eventId, categoryId, limit, offset, cancellationToken);

        var photoDtos = photos.Select(p => new PhotoDto(
            p.Id,
            $"/api/v1/events/{eventId}/photos/{p.Id}/secure",
            p.OriginalFileName,
            p.UploadedBy ?? "Anonymous",
            p.CategoryId,
            p.Width,
            p.Height,
            p.FileSizeBytes,
            p.CreatedAt
        )).ToList();

        _logger.LogDebug("Retrieved {Count} photos for event {EventId}", photoDtos.Count, eventId);

        return Result<PhotosResponse>.Success(
            new PhotosResponse(true, photoDtos, photoDtos.Count));
    }

    public async Task<Result<UploadPhotosResponse>> UploadPhotosAsync(
        Guid eventId,
        IReadOnlyList<UploadPhotoCommand> files,
        CancellationToken cancellationToken = default)
    {
        if (files.Count == 0)
            return Result<UploadPhotosResponse>.BadRequest("No files uploaded");

        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken);

        if (eventEntity is null)
            return Result<UploadPhotosResponse>.NotFound("Event not found");

        if (eventEntity.Status == EventStatus.Archived)
            return Result<UploadPhotosResponse>.BadRequest("This event no longer accepts photo uploads");

        var uploadedPhotos = new List<UploadedPhotoDto>();
        var userName = files.FirstOrDefault()?.UserName ?? "Anonymous";
        var hasNewContent = false;

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

                var photo = EventPhoto.Create(
                    eventId: eventId,
                    fileName: Path.GetFileName(storageResult.StoragePath),
                    originalFileName: file.FileName,
                    contentType: file.ContentType,
                    fileSizeBytes: file.FileSize,
                    storagePath: storageResult.StoragePath,
                    uploadedBy: file.UserName,
                    categoryId: file.CategoryId
                );

                _photoRepository.Add(photo);
                hasNewContent = true;

                uploadedPhotos.Add(new UploadedPhotoDto(photo.Id, file.FileName, photo.ImageUrl));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to process file {FileName}", file.FileName);
            }
        }

        if (hasNewContent && !eventEntity.HasContent)
        {
            eventEntity.MarkHasContent();
            _eventRepository.Update(eventEntity);
        }

        await _photoRepository.SaveChangesAsync(cancellationToken);

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
        MovePhotoCategoryCommand command,
        CancellationToken cancellationToken = default)
    {
        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken);

        if (eventEntity is null)
            return Result.NotFound("Event not found");

        var photo = await _photoRepository.GetByIdWithEventAsync(photoId, eventId, cancellationToken);

        if (photo is null)
            return Result.NotFound("Photo not found");

        photo.MoveToCategory(command.CategoryId);
        _photoRepository.Update(photo);
        await _photoRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Moved photo {PhotoId} to category {CategoryId}", photoId, command.CategoryId);

        return Result.Success();
    }

    public async Task<Result> DeletePhotoAsync(
        Guid eventId,
        Guid photoId,
        CancellationToken cancellationToken = default)
    {
        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken);

        if (eventEntity is null)
            return Result.NotFound("Event not found");

        var photo = await _photoRepository.GetByIdWithEventAsync(photoId, eventId, cancellationToken);

        if (photo is null)
            return Result.NotFound("Photo not found");

        if (!string.IsNullOrEmpty(photo.StoragePath))
        {
            await _fileStorage.DeleteFileAsync(photo.StoragePath, cancellationToken);
        }

        _photoRepository.Remove(photo);
        await _photoRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted photo {PhotoId}", photoId);

        return Result.Success();
    }

    public async Task<Result<FileResult>> GetPhotoImageAsync(
        Guid eventId,
        Guid photoId,
        CancellationToken cancellationToken = default)
    {
        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken);

        if (eventEntity is null)
            return Result<FileResult>.NotFound("Event not found");

        var photo = await _photoRepository.GetByIdWithEventAsync(photoId, eventId, cancellationToken);

        if (photo is null)
            return Result<FileResult>.NotFound("Photo not found");

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
