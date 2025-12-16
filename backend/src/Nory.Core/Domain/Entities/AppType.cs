namespace Nory.Core.Domain.Entities;

public class AppType
{
    public string Id { get; private set; } = null!;
    public string Name { get; private set; } = null!;
    public string? Description { get; private set; }
    public string Component { get; private set; } = null!;
    public string Icon { get; private set; } = null!;
    public string Color { get; private set; } = null!;
    public bool IsActive { get; private set; }

    private AppType() { }

    public AppType(
        string id,
        string name,
        string? description,
        string component,
        string icon,
        string color,
        bool isActive)
    {
        Id = id;
        Name = name;
        Description = description;
        Component = component;
        Icon = icon;
        Color = color;
        IsActive = isActive;
    }
}
