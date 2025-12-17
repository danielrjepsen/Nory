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
    private readonly IAttendeeRepository _attendeeRepository = Substitute.For<IAttendeeRepository>();
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

        _sut = new EventService(_eventRepository, _eventAppRepository, _attendeeRepository, _createValidator, _updateValidator, _logger);
    }

    [Fact]
    public async Task GetEventsAsync_ReturnsAllEvents()
    {
        var events = new List<Event>
        {
            EventBuilder.Default().WithName("Event 1").Build(),
            EventBuilder.Default().WithName("Event 2").Build()
        };
        _eventRepository.GetAllAsync(Arg.Any<CancellationToken>()).Returns(events);

        var result = await _sut.GetEventsAsync();

        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetEventsAsync_WhenNoEvents_ReturnsEmpty()
    {
        _eventRepository.GetAllAsync(Arg.Any<CancellationToken>())
            .Returns(new List<Event>());

        var result = await _sut.GetEventsAsync();

        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetEventByIdAsync_WhenExists_ReturnsEvent()
    {
        var eventId = Guid.NewGuid();
        var @event = EventBuilder.Default().WithId(eventId).Build();
        _eventRepository.GetByIdWithPhotosAsync(eventId, Arg.Any<CancellationToken>()).Returns(@event);

        var result = await _sut.GetEventByIdAsync(eventId);

        result.Should().NotBeNull();
        result!.Id.Should().Be(eventId);
    }

    [Fact]
    public async Task GetEventByIdAsync_WhenNotExists_ReturnsNull()
    {
        _eventRepository.GetByIdWithPhotosAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>())
            .Returns((Event?)null);

        var result = await _sut.GetEventByIdAsync(Guid.NewGuid());

        result.Should().BeNull();
    }

    [Fact]
    public async Task CreateEventAsync_CreatesEvent()
    {
        var dto = new CreateEventDto { Name = "New Event", Description = "Description", IsPublic = true };
        Event? captured = null;
        _eventRepository.When(x => x.Add(Arg.Any<Event>())).Do(x => captured = x.Arg<Event>());

        var result = await _sut.CreateEventAsync(dto);

        result.Name.Should().Be(dto.Name);
        captured.Should().NotBeNull();
        await _eventRepository.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UpdateEventAsync_UpdatesEvent()
    {
        var @event = EventBuilder.Default().Build();
        var dto = new UpdateEventDto { Name = "Updated" };
        _eventRepository.GetByIdAsync(@event.Id, Arg.Any<CancellationToken>()).Returns(@event);

        var result = await _sut.UpdateEventAsync(@event.Id, dto);

        result.Name.Should().Be("Updated");
        await _eventRepository.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UpdateEventAsync_WhenNotFound_Throws()
    {
        _eventRepository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns((Event?)null);

        var act = () => _sut.UpdateEventAsync(Guid.NewGuid(), new UpdateEventDto());

        await act.Should().ThrowAsync<KeyNotFoundException>();
    }

    [Fact]
    public async Task UpdateEventAsync_WithStatusChange_TransitionsStatus()
    {
        var @event = EventBuilder.Default().AsDraft().Build();
        _eventRepository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns(@event);

        var result = await _sut.UpdateEventAsync(@event.Id, new UpdateEventDto { Status = "Live" });

        result.Status.Should().Be("live");
    }

    [Fact]
    public async Task DeleteEventAsync_ArchivesEvent()
    {
        var @event = EventBuilder.Default().AsDraft().Build();
        _eventRepository.GetByIdAsync(@event.Id, Arg.Any<CancellationToken>()).Returns(@event);

        await _sut.DeleteEventAsync(@event.Id);

        @event.Status.Should().Be(EventStatus.Archived);
    }

    [Fact]
    public async Task StartEventAsync_TransitionsToLive()
    {
        var @event = EventBuilder.Default().AsDraft().Build();
        _eventRepository.GetByIdAsync(@event.Id, Arg.Any<CancellationToken>()).Returns(@event);

        var result = await _sut.StartEventAsync(@event.Id);

        result.Status.Should().Be("live");
    }

    [Fact]
    public async Task EndEventAsync_TransitionsToEnded()
    {
        var @event = EventBuilder.Default().AsLive().Build();
        _eventRepository.GetByIdAsync(@event.Id, Arg.Any<CancellationToken>()).Returns(@event);

        var result = await _sut.EndEventAsync(@event.Id);

        result.Status.Should().Be("ended");
    }
}
