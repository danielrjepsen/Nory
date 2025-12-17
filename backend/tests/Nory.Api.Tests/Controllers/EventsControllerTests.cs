using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Nory.Api.Tests.Fixtures;
using Nory.Application.DTOs.Events;
using Nory.Core.Tests.Builders;
using Nory.Infrastructure.Persistence.Extensions;
using Xunit;

namespace Nory.Api.Tests.Controllers;

[Collection("Api")]
public class EventsControllerTests(CustomWebApplicationFactory factory) : IAsyncLifetime
{
    private HttpClient _client = null!;

    public async Task InitializeAsync()
    {
        await factory.ResetDatabaseAsync();
        _client = factory.CreateAuthenticatedClient("test-user-123");
    }

    public Task DisposeAsync()
    {
        _client?.Dispose();
        return Task.CompletedTask;
    }

    [Fact]
    public async Task GetEvents_ReturnsAllEvents()
    {
        await SeedEvent("Event 1");
        await SeedEvent("Event 2");
        await SeedEvent("Event 3");

        var response = await _client.GetAsync("/api/v1/events");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var events = await response.Content.ReadFromJsonAsync<List<EventDto>>();
        events.Should().HaveCount(3);
    }

    [Fact]
    public async Task GetEvents_WhenUnauthenticated_Returns401()
    {
        var client = factory.CreateUnauthenticatedClient();

        var response = await client.GetAsync("/api/v1/events");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetEventById_ReturnsEvent()
    {
        var eventId = await SeedEvent("Test Event");

        var response = await _client.GetAsync($"/api/v1/events/{eventId}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var @event = await response.Content.ReadFromJsonAsync<EventDto>();
        @event!.Name.Should().Be("Test Event");
    }

    [Fact]
    public async Task GetEventById_WhenNotFound_Returns404()
    {
        var response = await _client.GetAsync($"/api/v1/events/{Guid.NewGuid()}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateEvent_ReturnsCreated()
    {
        var request = new CreateEventDto { Name = "New Event", Description = "Desc", IsPublic = true };

        var response = await _client.PostAsJsonAsync("/api/v1/events", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        response.Headers.Location.Should().NotBeNull();
        var created = await response.Content.ReadFromJsonAsync<EventDto>();
        created!.Name.Should().Be("New Event");
        created.Status.Should().Be("draft");
    }

    [Fact]
    public async Task CreateEvent_WhenInvalid_Returns400()
    {
        var request = new CreateEventDto { Name = "", IsPublic = true };

        var response = await _client.PostAsJsonAsync("/api/v1/events", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateEvent_ReturnsUpdated()
    {
        var eventId = await SeedEvent("Original");

        var response = await _client.PatchAsJsonAsync($"/api/v1/events/{eventId}",
            new UpdateEventDto { Name = "Updated" });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var updated = await response.Content.ReadFromJsonAsync<EventDto>();
        updated!.Name.Should().Be("Updated");
    }

    [Fact]
    public async Task DeleteEvent_ArchivesEvent()
    {
        var eventId = await SeedEvent("To Delete");

        var response = await _client.DeleteAsync($"/api/v1/events/{eventId}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        var getResponse = await _client.GetAsync($"/api/v1/events/{eventId}");
        var @event = await getResponse.Content.ReadFromJsonAsync<EventDto>();
        @event!.Status.Should().Be("archived");
    }

    [Fact]
    public async Task StartEvent_TransitionsToLive()
    {
        var eventId = await SeedEvent("Draft Event");

        var response = await _client.PostAsync($"/api/v1/events/{eventId}/start", null);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var @event = await response.Content.ReadFromJsonAsync<EventDto>();
        @event!.Status.Should().Be("live");
    }

    [Fact]
    public async Task EndEvent_TransitionsToEnded()
    {
        var eventId = await SeedLiveEvent("Live Event");

        var response = await _client.PostAsync($"/api/v1/events/{eventId}/end", null);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var @event = await response.Content.ReadFromJsonAsync<EventDto>();
        @event!.Status.Should().Be("ended");
    }

    private async Task<Guid> SeedEvent(string name)
    {
        var @event = EventBuilder.Default().WithName(name).Create();
        var db = factory.GetDbContext();
        db.Events.Add(@event.MapToDbModel());
        await db.SaveChangesAsync();
        return @event.Id;
    }

    private async Task<Guid> SeedLiveEvent(string name)
    {
        var @event = EventBuilder.Default().WithName(name).Create();
        @event.Start();
        var db = factory.GetDbContext();
        db.Events.Add(@event.MapToDbModel());
        await db.SaveChangesAsync();
        return @event.Id;
    }
}
