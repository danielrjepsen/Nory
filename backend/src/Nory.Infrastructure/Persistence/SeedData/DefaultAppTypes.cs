using Nory.Core.Domain.Entities;

namespace Nory.Infrastructure.Persistence.SeedData;

public static class DefaultAppTypes
{
    public static IReadOnlyList<AppType> GetAll() =>
    [
        new AppType(
            id: "tv-remote",
            name: "TV Remote",
            description: "Control the event slideshow from your phone",
            component: "remote",
            icon: "tv",
            color: "#6366f1",
            isActive: true),

        new AppType(
            id: "photos",
            name: "Photo Gallery",
            description: "Browse and upload event photos",
            component: "gallery",
            icon: "image",
            color: "#10b981",
            isActive: true),

        new AppType(
            id: "guestbook",
            name: "Guestbook",
            description: "Leave messages for the hosts",
            component: "guestbook",
            icon: "book-open",
            color: "#f59e0b",
            isActive: true),

        new AppType(
            id: "lists",
            name: "Wishlists",
            description: "View and manage event wishlists",
            component: "lists",
            icon: "list",
            color: "#ec4899",
            isActive: true),

        new AppType(
            id: "schedule",
            name: "Event Schedule",
            description: "View the event timeline and activities",
            component: "schedule",
            icon: "calendar",
            color: "#8b5cf6",
            isActive: true),

        new AppType(
            id: "polls",
            name: "Live Polls",
            description: "Participate in live polls and voting",
            component: "polls",
            icon: "bar-chart",
            color: "#06b6d4",
            isActive: true),

        new AppType(
            id: "custom",
            name: "Custom App",
            description: "Custom application component",
            component: "custom",
            icon: "code",
            color: "#64748b",
            isActive: true)
    ];
}
