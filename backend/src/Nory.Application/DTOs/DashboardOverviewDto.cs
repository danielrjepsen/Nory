using Nory.Application.DTOs.Events;

namespace Nory.Application.DTOs;

public class DashboardOverviewDto
{
    public List<EventDto> Events { get; init; } = [];
    public AggregatedEventMetricsDto Analytics { get; init; } = new();
    public List<ActivityLogDto> RecentActivity { get; init; } = [];
}
