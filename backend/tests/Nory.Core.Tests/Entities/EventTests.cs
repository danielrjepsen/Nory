using FluentAssertions;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Enums;
using Nory.Core.Tests.Builders;
using Xunit;

namespace Nory.Core.Tests.Entities;

public class EventTests
{
    [Fact]
    public void Create_WithValidData_CreatesEvent()
    {
        var @event = Event.Create("user-123", "Birthday Party");

        @event.Id.Should().NotBeEmpty();
        @event.UserId.Should().Be("user-123");
        @event.Name.Should().Be("Birthday Party");
        @event.Status.Should().Be(EventStatus.Draft);
        @event.IsPublic.Should().BeTrue();
        @event.HasContent.Should().BeFalse();
    }

    [Fact]
    public void Create_WithAllParameters_SetsAllProperties()
    {
        var startsAt = DateTime.UtcNow.AddDays(7);
        var endsAt = DateTime.UtcNow.AddDays(8);

        var @event = Event.Create("user-123", "Wedding", "Beautiful wedding", "Beach",
            startsAt, endsAt, isPublic: false, "elegant");

        @event.Description.Should().Be("Beautiful wedding");
        @event.Location.Should().Be("Beach");
        @event.StartsAt.Should().Be(startsAt);
        @event.EndsAt.Should().Be(endsAt);
        @event.IsPublic.Should().BeFalse();
        @event.ThemeName.Should().Be("elegant");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Create_WithInvalidName_Throws(string? invalidName)
    {
        var act = () => Event.Create("user-123", invalidName!);

        act.Should().Throw<ArgumentException>().WithMessage("*name*");
    }

    [Fact]
    public void Create_WithNameOver200Chars_Throws()
    {
        var act = () => Event.Create("user-123", new string('a', 201));

        act.Should().Throw<ArgumentException>().WithMessage("*200*");
    }

    [Fact]
    public void Create_WithEndBeforeStart_Throws()
    {
        var act = () => Event.Create("user-123", "Test",
            startsAt: DateTime.UtcNow.AddDays(2),
            endsAt: DateTime.UtcNow.AddDays(1));

        act.Should().Throw<ArgumentException>().WithMessage("*End date*");
    }

    [Fact]
    public void UpdateDetails_UpdatesProperties()
    {
        var @event = EventBuilder.Default().Build();

        @event.UpdateDetails(name: "Updated", description: "New desc");

        @event.Name.Should().Be("Updated");
        @event.Description.Should().Be("New desc");
    }

    [Fact]
    public void UpdateDetails_OnArchived_Throws()
    {
        var @event = EventBuilder.Default().AsArchived().Build();

        var act = () => @event.UpdateDetails(name: "New");

        act.Should().Throw<InvalidOperationException>().WithMessage("*archived*");
    }

    [Fact]
    public void UpdateDetails_WithNullValues_KeepsOriginal()
    {
        var @event = EventBuilder.Default().WithName("Original").WithDescription("Desc").Build();

        @event.UpdateDetails(name: null, description: "New");

        @event.Name.Should().Be("Original");
        @event.Description.Should().Be("New");
    }

    [Fact]
    public void Start_FromDraft_TransitionsToLive()
    {
        var @event = EventBuilder.Default().AsDraft().Build();

        @event.Start();

        @event.Status.Should().Be(EventStatus.Live);
    }

    [Theory]
    [InlineData(EventStatus.Live)]
    [InlineData(EventStatus.Ended)]
    [InlineData(EventStatus.Archived)]
    public void Start_FromNonDraft_Throws(EventStatus status)
    {
        var @event = EventBuilder.Default().WithStatus(status).Build();

        var act = () => @event.Start();

        act.Should().Throw<InvalidOperationException>().WithMessage("*draft*");
    }

    [Fact]
    public void End_FromLive_TransitionsToEnded()
    {
        var @event = EventBuilder.Default().AsLive().Build();

        @event.End();

        @event.Status.Should().Be(EventStatus.Ended);
    }

    [Theory]
    [InlineData(EventStatus.Draft)]
    [InlineData(EventStatus.Ended)]
    [InlineData(EventStatus.Archived)]
    public void End_FromNonLive_Throws(EventStatus status)
    {
        var @event = EventBuilder.Default().WithStatus(status).Build();

        var act = () => @event.End();

        act.Should().Throw<InvalidOperationException>().WithMessage("*live*");
    }

    [Theory]
    [InlineData(EventStatus.Draft)]
    [InlineData(EventStatus.Ended)]
    public void Archive_FromValidStatus_TransitionsToArchived(EventStatus status)
    {
        var @event = EventBuilder.Default().WithStatus(status).Build();

        @event.Archive();

        @event.Status.Should().Be(EventStatus.Archived);
    }

    [Fact]
    public void Archive_FromLive_Throws()
    {
        var @event = EventBuilder.Default().AsLive().Build();

        var act = () => @event.Archive();

        act.Should().Throw<InvalidOperationException>().WithMessage("*End it first*");
    }

    [Fact]
    public void BelongsTo_WithMatchingUser_ReturnsTrue()
    {
        var @event = EventBuilder.Default().WithUserId("user-123").Build();

        @event.BelongsTo("user-123").Should().BeTrue();
    }

    [Fact]
    public void BelongsTo_WithDifferentUser_ReturnsFalse()
    {
        var @event = EventBuilder.Default().WithUserId("user-123").Build();

        @event.BelongsTo("other").Should().BeFalse();
    }

    [Fact]
    public void MarkHasContent_SetsFlag()
    {
        var @event = EventBuilder.Default().Build();

        @event.MarkHasContent();

        @event.HasContent.Should().BeTrue();
    }

    [Fact]
    public void MarkHasContent_WhenAlreadySet_DoesNotUpdateTimestamp()
    {
        var originalUpdatedAt = DateTime.UtcNow.AddHours(-1);
        var @event = new Event(Guid.NewGuid(), "user", "Test", null, null, null, null,
            EventStatus.Draft, true, true, null, DateTime.UtcNow.AddHours(-2), originalUpdatedAt);

        @event.MarkHasContent();

        @event.UpdatedAt.Should().Be(originalUpdatedAt);
    }
}
