namespace Nory.Application.DTOs.Events;

public class UpdateEventDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime? StartsAt { get; set; }
    public DateTime? EndsAt { get; set; }
}
