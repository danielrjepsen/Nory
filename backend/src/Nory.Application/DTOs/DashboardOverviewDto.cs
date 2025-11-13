public class DashboardOverviewDto
{
    public List<EventSummaryDto> Events { get; set; } = new();
    public OrgAnalyticsSummaryDto Analytics { get; set; } = new();
    public List<ActivitySummaryDto> RecentActivity { get; set; } = new();
}