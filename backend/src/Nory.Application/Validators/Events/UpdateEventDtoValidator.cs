using FluentValidation;
using Nory.Application.DTOs.Events;

namespace Nory.Application.Validators.Events;

public class UpdateEventDtoValidator : AbstractValidator<UpdateEventDto>
{
    public UpdateEventDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Event name is required")
            .MinimumLength(1)
            .WithMessage("Event name must be at least 1 character")
            .MaximumLength(200)
            .WithMessage("Event name cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000)
            .WithMessage("Description cannot exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));
    }
}
