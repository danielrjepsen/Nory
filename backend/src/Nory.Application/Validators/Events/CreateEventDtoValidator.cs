using FluentValidation;
using Nory.Application.DTOs.Events;

namespace Nory.Application.Validators.Events;

public class CreateEventDtoValidator : AbstractValidator<CreateEventDto>
{
    public CreateEventDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Event name is required")
            .MinimumLength(1)
            .WithMessage("Event name must be at least 1 character")
            .MaximumLength(200)
            .WithMessage("Event name cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(2000)
            .WithMessage("Description cannot exceed 2000 characters")
            .When(x => x.Description is not null);

        RuleFor(x => x.EndsAt)
            .GreaterThan(x => x.StartsAt!.Value)
            .WithMessage("End date must be after start date")
            .When(x => x.StartsAt.HasValue && x.EndsAt.HasValue);

        RuleFor(x => x.ThemeName)
            .MaximumLength(100)
            .WithMessage("Theme name cannot exceed 100 characters")
            .When(x => x.ThemeName is not null);
    }
}
