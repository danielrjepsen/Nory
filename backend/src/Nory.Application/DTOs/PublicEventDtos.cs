namespace Nory.Application.DTOs;

public record PublicPhotoDto(
    Guid Id,
    string ImageUrl,
    string OriginalFileName,
    string UploadedBy,
    Guid? CategoryId,
    int? Width,
    int? Height,
    DateTime CreatedAt
);

public record PublicPhotosResponse(
    bool Success,
    IReadOnlyList<PublicPhotoDto> Photos,
    int TotalCount
);

public record PublicCategoryDto(
    string Id,
    string Name,
    string? Description,
    int SortOrder,
    bool IsDefault,
    int PhotoCount,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record PublicCategoriesResponse(
    bool Success,
    IReadOnlyList<PublicCategoryDto> Categories
);

public record EventTemplateDto(
    string Name,
    string? DisplayName,
    string PrimaryColor,
    string SecondaryColor,
    string AccentColor,
    string? BackgroundColor1,
    string? BackgroundColor2,
    string? BackgroundColor3,
    string? TextPrimary,
    string? TextSecondary,
    string? TextAccent,
    string? PrimaryFont,
    string? SecondaryFont,
    string? DarkBackgroundGradient,
    string? DarkParticleColors
);

public record TemplateResponse(EventTemplateDto? Template);

public record FileResult(Stream FileStream, string ContentType);

public record GetPhotosQuery(
    Guid? CategoryId = null,
    int Limit = 100,
    int Offset = 0,
    bool Preview = false
);
