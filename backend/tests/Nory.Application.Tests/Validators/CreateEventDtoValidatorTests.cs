using FluentAssertions;
using Nory.Application.DTOs.Events;
using Nory.Application.Validators.Events;
using Xunit;

namespace Nory.Application.Tests.Validators;

public class CreateEventDtoValidatorTests
{
    private readonly CreateEventDtoValidator _validator = new();

    [Fact]
    public void Name_WhenEmpty_Invalid()
    {
        var result = _validator.Validate(new CreateEventDto { Name = "" });

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Fact]
    public void Name_WhenWhitespace_Invalid()
    {
        var result = _validator.Validate(new CreateEventDto { Name = "   " });

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name");
    }

    [Fact]
    public void Name_WhenTooLong_Invalid()
    {
        var result = _validator.Validate(new CreateEventDto { Name = new string('a', 201) });

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Name" && e.ErrorMessage.Contains("200"));
    }

    [Fact]
    public void Name_WhenValid_NoError()
    {
        var result = _validator.Validate(new CreateEventDto { Name = "Valid Event Name" });

        result.Errors.Should().NotContain(e => e.PropertyName == "Name");
    }

    [Fact]
    public void Description_WhenTooLong_Invalid()
    {
        var result = _validator.Validate(new CreateEventDto { Name = "Valid", Description = new string('a', 2001) });

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Description");
    }

    [Fact]
    public void Description_WhenNull_Valid()
    {
        var result = _validator.Validate(new CreateEventDto { Name = "Valid", Description = null });

        result.Errors.Should().NotContain(e => e.PropertyName == "Description");
    }

    [Fact]
    public void Dates_WhenEndBeforeStart_Invalid()
    {
        var result = _validator.Validate(new CreateEventDto
        {
            Name = "Valid",
            StartsAt = DateTime.UtcNow.AddDays(2),
            EndsAt = DateTime.UtcNow.AddDays(1)
        });

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "EndsAt");
    }

    [Fact]
    public void Dates_WhenEndAfterStart_Valid()
    {
        var result = _validator.Validate(new CreateEventDto
        {
            Name = "Valid",
            StartsAt = DateTime.UtcNow.AddDays(1),
            EndsAt = DateTime.UtcNow.AddDays(2)
        });

        result.Errors.Should().NotContain(e => e.PropertyName == "EndsAt");
    }

    [Fact]
    public void Dates_WhenBothNull_Valid()
    {
        var result = _validator.Validate(new CreateEventDto { Name = "Valid", StartsAt = null, EndsAt = null });

        result.Errors.Should().NotContain(e => e.PropertyName == "StartsAt");
        result.Errors.Should().NotContain(e => e.PropertyName == "EndsAt");
    }

    [Fact]
    public void FullDto_WhenValid_Passes()
    {
        var result = _validator.Validate(new CreateEventDto
        {
            Name = "Birthday Party",
            Description = "A fun celebration",
            Location = "Home",
            StartsAt = DateTime.UtcNow.AddDays(7),
            EndsAt = DateTime.UtcNow.AddDays(8),
            IsPublic = true
        });

        result.IsValid.Should().BeTrue();
    }
}
