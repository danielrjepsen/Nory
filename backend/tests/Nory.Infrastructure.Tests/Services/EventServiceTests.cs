using FluentAssertions;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.Extensions.Logging;
using Nory.Application.DTOs.Events;
using Nory.Core.Domain.Entities;
using Nory.Core.Domain.Enums;
using Nory.Core.Domain.Repositories;
using Nory.Core.Tests.Builders;
using Nory.Infrastructure.Services;
using NSubstitute;
using Xunit;

namespace Nory.Infrastructure.Tests.Services;

public class EventServiceTests
{
    private readonly IEventRepository _eventRepository = Substitute.For<IEventRepository>();
    private readonly IEventAppRepository _eventAppRepository = Substitute.For<IEventAppRepository>();
    private readonly IValidator<CreateEventDto> _createValidator = Substitute.For<IValidator<CreateEventDto>>();
    private readonly IValidator<UpdateEventDto> _updateValidator = Substitute.For<IValidator<UpdateEventDto>>();
    private readonly ILogger<EventService> _logger = Substitute.For<ILogger<EventService>>();
    private readonly EventService _sut;

    public EventServiceTests()
    {
        _createValidator.ValidateAsync(Arg.Any<CreateEventDto>(), Arg.Any<CancellationToken>())
            .Returns(new ValidationResult());
        _updateValidator.ValidateAsync(Arg.Any<UpdateEventDto>(), Arg.Any<CancellationToken>())
            .Returns(new ValidationResult());

        _sut = new EventService(_eventRepository, _eventAppRepository, _createValidator, _updateValidator, _logger);
    }

    [Fact]
    public async Task GetEventsAsync_ReturnsUserEvents()
    {
        var userId = "user-123";
        var events = new List<Event>
        {
            EventBuilder.Default().WithUserId(userId).WithName("Event 1").Build(),
            EventBuilder.Default().WithUserId(userId).WithName("Event 2").Build()
        };
        _eventRepository.GetByUserIdAsync(userId, Arg.Any<CancellationToken>()).Returns(events);

        var result = await _sut.GetEventsAsync(userId);

        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetEventsAsync_WhenNoEvents_ReturnsEmpty()
    {
        _eventRepository.GetByUserIdAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
            .Returns(new List<Event>());

        var result = await _sut.GetEventsAsync("user-123");

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetEventByIdAsync_WhenExistsAndOwned_ReturnsEvent()
    {
        var eventId = Guid.NewGuid();
        var userId = "user-123";
        var @event = EventBuilder.Default().WithId(eventId).WithUserId(userId).Build();
        _eventRepository.GetByIdWithPhotosAsync(eventId, Arg.Any<CancellationToken>()).Returns(@event);

        var result = await _sut.GetEventByIdAsync(eventId, userId);

        result.Should().NotBeNull();
        result!.Id.Should().Be(eventId);
    }

    [Fact]
    public async Task GetEventByIdAsync_WhenNotExists_ReturnsNull()
    {
        _eventRepository.GetByIdWithPhotosAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns((Event?)null);

        var result = await _sut.GetEventByIdAsync(Guid.NewGuid(), "user-123");

        result.Should().BeNull();
    }

    [Fact]
    public async Task GetEventByIdAsync_WhenNotOwned_ReturnsNull()
    {
        var @event = EventBuilder.Default().WithUserId("owner-user").Build();
        _eventRepository.GetByIdWithPhotosAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns(@event);

        var result = await _sut.GetEventByIdAsync(@event.Id, "different-user");

        result.Should().BeNull();
    }

    [Fact]
    public async Task CreateEventAsync_CreatesEvent()
    {
        var userId = "user-123";
        var dto = new CreateEventDto { Name = "New Event", Description = "Description", IsPublic = true };
        Event? captured = null;
        _eventRepository.When(x => x.Add(Arg.Any<Event>())).Do(x => captured = x.Arg<Event>());

        var result = await _sut.CreateEventAsync(dto, userId);

        result.Name.Should().Be(dto.Name);
        captured!.UserId.Should().Be(userId);
        await _eventRepository.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UpdateEventAsync_UpdatesEvent()
    {
        var @event = EventBuilder.Default().Build();
        var dto = new UpdateEventDto { Name = "Updated" };
        _eventRepository.GetByIdAsync(@event.Id, Arg.Any<CancellationToken>()).Returns(@event);

        var result = await _sut.UpdateEventAsync(@event.Id, dto, @event.UserId);

        result.Name.Should().Be("Updated");
        await _eventRepository.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UpdateEventAsync_WhenNotFound_Throws()
    {
        _eventRepository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns((Event?)null);

        var act = () => _sut.UpdateEventAsync(Guid.NewGuid(), new UpdateEventDto(), "user");

        await act.Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task UpdateEventAsync_WhenNotOwned_Throws()
    {
        var @event = EventBuilder.Default().WithUserId("owner").Build();
        _eventRepository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns(@event);

        var act = () => _sut.UpdateEventAsync(@event.Id, new UpdateEventDto(), "other");

        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Fact]
    public async Task UpdateEventAsync_WithStatusChange_TransitionsStatus()
    {
        var @event = EventBuilder.Default().AsDraft().Build();
        _eventRepository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns(@event);

        var result = await _sut.UpdateEventAsync(@event.Id, new UpdateEventDto { Status = "Live" }, @event.UserId);

        result.Status.Should().Be("live");
    }

    [Fact]
    public async Task DeleteEventAsync_ArchivesEvent()
    {
        var @event = EventBuilder.Default().AsDraft().Build();
        _eventRepository.GetByIdAsync(@event.Id, Arg.Any<CancellationToken>()).Returns(@event);

        await _sut.DeleteEventAsync(@event.Id, @event.UserId);

        @event.Status.Should().Be(EventStatus.Archived);
    }

    [Fact]
    public async Task StartEventAsync_TransitionsToLive()
    {
        var @event = EventBuilder.Default().AsDraft().Build();
        _eventRepository.GetByIdAsync(@event.Id, Arg.Any<CancellationToken>()).Returns(@event);

        var result = await _sut.StartEventAsync(@event.Id, @event.UserId);

        result.Status.Should().Be("live");
    }

    [Fact]
    public async Task EndEventAsync_TransitionsToEnded()
    {
        var @event = EventBuilder.Default().AsLive().Build();
        _eventRepository.GetByIdAsync(@event.Id, Arg.Any<CancellationToken>()).Returns(@event);

        var result = await _sut.EndEventAsync(@event.Id, @event.UserId);

        result.Status.Should().Be("ended");
    }
}
