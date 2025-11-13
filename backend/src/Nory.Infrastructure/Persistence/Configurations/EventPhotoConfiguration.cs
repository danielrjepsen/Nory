using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Nory.Infrastructure.Persistence.Configurations;

public class EventPhotoConfiguration : IEntityTypeConfiguration<EventPhotoDbModel>
{
    public void Configure(EntityTypeBuilder<EventPhotoDbModel> builder)
    {
        builder.ToTable("EventPhotos");

        builder.HasIndex(p => p.EventId)
            .HasDatabaseName("IX_EventPhotos_EventId");

        builder.HasIndex(p => new { p.EventId, p.CreatedAt })
            .HasDatabaseName("IX_EventPhotos_EventId_CreatedAt");
    }
}