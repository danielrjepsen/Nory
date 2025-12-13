using FluentValidation;
using Nory.Application.DTOs.Events;

namespace Nory.Application.Validators.Events;

public class UpdateEventDtoValidator : AbstractValidator<UpdateEventDto>
{
    public UpdateEventDtoValidator()
    {
        RuleFor(x => x.Name)
            .MinimumLength(1)
            .WithMessage("Event name must be at least 1 character")
            .MaximumLength(200)
            .WithMessage("Event name cannot exceed 200 characters")
            .When(x => x.Name is not null);

        RuleFor(x => x.Description)
            .MaximumLength(2000)
            .WithMessage("Description cannot exceed 2000 characters")
            .When(x => x.Description is not null);

        RuleFor(x => x.EndsAt)
            .GreaterThan(x => x.StartsAt!.Value)
            .WithMessage("End date must be after start date")
            .When(x => x.StartsAt.HasValue && x.EndsAt.HasValue);

        RuleFor(x => x.Status)
            .Must(BeValidStatus)
            .WithMessage("Invalid status. Must be one of: draft, live, ended, archived")
            .When(x => x.Status is not null);

        RuleFor(x => x.ThemeName)
            .MaximumLength(100)
            .WithMessage("Theme name cannot exceed 100 characters")
            .When(x => x.ThemeName is not null);
    }

    private static bool BeValidStatus(string? status)
    {
        if (status is null) return true;
        var validStatuses = new[] { "draft", "live", "ended", "archived" };
        return validStatuses.Contains(status.ToLowerInvariant());
    }
}
