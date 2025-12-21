using Microsoft.Extensions.Logging;
using Nory.Application.Common;
using Nory.Application.DTOs;
using Nory.Application.Services;
using Nory.Core.Domain.Enums;
using Nory.Core.Domain.Repositories;

namespace Nory.Infrastructure.Services;

public class PublicEventService : IPublicEventService
{
    private readonly IEventRepository _eventRepository;
    private readonly IEventPhotoRepository _photoRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IThemeService _themeService;
    private readonly IFileStorageService _fileStorage;
    private readonly ILogger<PublicEventService> _logger;

    public PublicEventService(
        IEventRepository eventRepository,
        IEventPhotoRepository photoRepository,
        ICategoryRepository categoryRepository,
        IThemeService themeService,
        IFileStorageService fileStorage,
        ILogger<PublicEventService> logger
    )
    {
        _eventRepository = eventRepository;
        _photoRepository = photoRepository;
        _categoryRepository = categoryRepository;
        _themeService = themeService;
        _fileStorage = fileStorage;
        _logger = logger;
    }

    public async Task<Result<PublicEventsResponse>> GetPublicEventsAsync(
        CancellationToken cancellationToken = default
    )
    {
        _logger.LogDebug("Fetching public events");

        var events = await _eventRepository.GetPublicAsync(cancellationToken);

        var eventDtos = events
            .Select(e => new PublicEventDto(
                e.Id,
                e.Name,
                e.Description,
                e.Location,
                e.StartsAt,
                e.EndsAt,
                e.ThemeName
            ))
            .ToList();

        _logger.LogDebug("Retrieved {Count} public events", eventDtos.Count);

        return Result<PublicEventsResponse>.Success(
            new PublicEventsResponse(true, eventDtos)
        );
    }

    public async Task<Result<PublicPhotosResponse>> GetPhotosAsync(
        Guid eventId,
        GetPhotosQuery query,
        CancellationToken cancellationToken = default
    )
    {
        _logger.LogDebug(
            "Fetching photos for event {EventId}, limit: {Limit}, offset: {Offset}, preview: {Preview}",
            eventId,
            query.Limit,
            query.Offset,
            query.Preview
        );

        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken);

        if (eventEntity is null)
        {
            _logger.LogWarning("Event {EventId} not found", eventId);
            return Result<PublicPhotosResponse>.NotFound("Event not found");
        }

        var statusCheck = CheckEventStatus(eventEntity.Status, eventEntity.EndsAt, query.Preview);
        if (!statusCheck.IsSuccess)
        {
            return Result<PublicPhotosResponse>.BadRequest(statusCheck.Error!);
        }

        var photos = await _photoRepository.GetByEventIdAsync(
            eventId,
            query.CategoryId,
            query.Limit,
            query.Offset,
            cancellationToken
        );

        var photoDtos = photos
            .Select(p => new PublicPhotoDto(
                p.Id,
                $"/api/v1/events/{eventId}/photos/{p.Id}/image",
                p.OriginalFileName,
                p.UploadedBy ?? "Anonymous",
                p.CategoryId,
                p.Width,
                p.Height,
                p.CreatedAt
            ))
            .ToList();

        _logger.LogDebug(
            "Retrieved {Count} photos for event {EventId}",
            photoDtos.Count,
            eventId
        );

        return Result<PublicPhotosResponse>.Success(
            new PublicPhotosResponse(true, photoDtos, photoDtos.Count)
        );
    }

    public async Task<Result<FileResult>> GetPhotoImageAsync(
        Guid eventId,
        Guid photoId,
        CancellationToken cancellationToken = default
    )
    {
        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken);

        if (eventEntity is null)
            return Result<FileResult>.NotFound("Photo not found");

        if (!IsEventViewable(eventEntity.Status, eventEntity.EndsAt))
            return Result<FileResult>.NotFound("Photo not found");

        var photo = await _photoRepository.GetByIdWithEventAsync(
            photoId,
            eventId,
            cancellationToken
        );

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
            _logger.LogWarning(
                "File not found for photo {PhotoId}: {Path}",
                photoId,
                photo.StoragePath
            );
            return Result<FileResult>.NotFound("Photo not found");
        }

        return Result<FileResult>.Success(
            new FileResult(fileResult.FileStream, fileResult.ContentType)
        );
    }

    public async Task<Result<PublicCategoriesResponse>> GetCategoriesAsync(
        Guid eventId,
        CancellationToken cancellationToken = default
    )
    {
        _logger.LogDebug("Fetching categories for event {EventId}", eventId);

        var categories = await _categoryRepository.GetByEventIdAsync(eventId, cancellationToken);

        var categoryDtos = categories
            .Select(c => new PublicCategoryDto(
                c.Id.ToString(),
                c.Name,
                c.Description,
                c.SortOrder,
                c.IsDefault,
                c.PhotoCount,
                c.CreatedAt,
                c.UpdatedAt
            ))
            .ToList();

        return Result<PublicCategoriesResponse>.Success(
            new PublicCategoriesResponse(true, categoryDtos)
        );
    }

    public async Task<Result<TemplateResponse>> GetTemplateAsync(
        Guid eventId,
        CancellationToken cancellationToken = default
    )
    {
        var eventEntity = await _eventRepository.GetByIdAsync(eventId, cancellationToken);

        if (eventEntity is null)
            return Result<TemplateResponse>.NotFound("Event not found");

        if (!string.IsNullOrEmpty(eventEntity.ThemeName))
        {
            var themeResult = await _themeService.GetThemeByNameAsync(
                eventEntity.ThemeName,
                cancellationToken
            );
            if (themeResult.IsSuccess)
            {
                var theme = themeResult.Data!;
                return Result<TemplateResponse>.Success(
                    new TemplateResponse(
                        new EventTemplateDto(
                            theme.Name,
                            theme.DisplayName,
                            theme.PrimaryColor,
                            theme.SecondaryColor,
                            theme.AccentColor,
                            theme.BackgroundColor1,
                            theme.BackgroundColor2,
                            theme.BackgroundColor3,
                            theme.TextPrimary,
                            theme.TextSecondary,
                            theme.TextAccent,
                            theme.PrimaryFont,
                            theme.SecondaryFont,
                            theme.DarkBackgroundGradient,
                            theme.DarkParticleColors
                        )
                    )
                );
            }
        }

        return Result<TemplateResponse>.Success(new TemplateResponse(null));
    }

    private static Result CheckEventStatus(EventStatus status, DateTime? endsAt, bool preview)
    {
        if (status == EventStatus.Archived)
            return Result.NotFound("Event not found");

        if (status == EventStatus.Ended)
            return Result.BadRequest($"This event has ended|status=ended|endsAt={endsAt}");

        if (status == EventStatus.Draft && !preview)
            return Result.BadRequest("This event is not yet live|status=draft");

        return Result.Success();
    }

    private static bool IsEventViewable(EventStatus status, DateTime? endsAt)
    {
        if (status == EventStatus.Live)
            return true;

        if (status == EventStatus.Ended && endsAt.HasValue)
        {
            var daysSinceEnd = (DateTime.UtcNow - endsAt.Value).TotalDays;
            return daysSinceEnd <= 30;
        }

        return false;
    }
}
