using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Nory.Infrastructure.Identity;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    // entities
    public DbSet<EventDbModel> Events { get; set; }
    public DbSet<EventPhotoDbModel> EventPhotos { get; set; }
    public DbSet<EventCategoryDbModel> EventCategories { get; set; }
    public DbSet<EventAppDbModel> EventApps { get; set; }
    public DbSet<AppTypeDbModel> AppTypes { get; set; }

    // Theme entities
    public DbSet<ThemeDbModel> Themes { get; set; }
    public DbSet<EventTemplateDbModel> EventTemplates { get; set; }

    // Analytics entities
    public DbSet<ActivityLogDbModel> ActivityLogs { get; set; }
    public DbSet<EventMetricsDbModel> EventMetrics { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>().ToTable("Users");
        builder.Entity<EventDbModel>().ToTable("Events");
        builder.Entity<EventPhotoDbModel>().ToTable("EventPhotos");
        builder.Entity<EventCategoryDbModel>().ToTable("EventCategories");
        builder.Entity<EventAppDbModel>().ToTable("EventApps");
        builder.Entity<AppTypeDbModel>().ToTable("AppTypes");

        builder.Entity<ActivityLogDbModel>().ToTable("ActivityLogs");
        builder.Entity<EventMetricsDbModel>().ToTable("EventMetrics");

        // Theme tables
        builder.Entity<ThemeDbModel>().ToTable("Themes");
        builder.Entity<EventTemplateDbModel>().ToTable("EventTemplates");

        // event indexes
        builder
            .Entity<EventPhotoDbModel>()
            .HasIndex(p => p.EventId)
            .HasDatabaseName("IX_EventPhotos_EventId");

        builder
            .Entity<EventCategoryDbModel>()
            .HasIndex(c => c.EventId)
            .HasDatabaseName("IX_EventCategories_EventId");

        builder
            .Entity<EventAppDbModel>()
            .HasIndex(ea => ea.EventId)
            .HasDatabaseName("IX_EventApps_EventId");

        // Analytics indexes
        builder
            .Entity<ActivityLogDbModel>()
            .HasIndex(a => a.EventId)
            .HasDatabaseName("IX_ActivityLogs_EventId");

        builder
            .Entity<ActivityLogDbModel>()
            .HasIndex(a => new { a.EventId, a.Type })
            .HasDatabaseName("IX_ActivityLogs_EventId_Type");

        builder
            .Entity<ActivityLogDbModel>()
            .HasIndex(a => a.CreatedAt)
            .HasDatabaseName("IX_ActivityLogs_CreatedAt");

        builder
            .Entity<EventMetricsDbModel>()
            .HasIndex(m => new { m.EventId, m.PeriodType })
            .HasDatabaseName("IX_EventMetrics_EventId_PeriodType");

        // event
        builder
            .Entity<EventDbModel>()
            .HasMany(e => e.Photos)
            .WithOne(p => p.Event)
            .HasForeignKey(p => p.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .Entity<EventDbModel>()
            .HasMany(e => e.Categories)
            .WithOne(c => c.Event)
            .HasForeignKey(c => c.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .Entity<EventCategoryDbModel>()
            .HasMany(c => c.Photos)
            .WithOne(p => p.Category)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .Entity<EventPhotoDbModel>()
            .HasIndex(p => p.CategoryId)
            .HasDatabaseName("IX_EventPhotos_CategoryId");

        builder
            .Entity<EventDbModel>()
            .HasMany(e => e.EventApps)
            .WithOne(ea => ea.Event)
            .HasForeignKey(ea => ea.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        // Analytics
        builder
            .Entity<ActivityLogDbModel>()
            .HasOne(a => a.Event)
            .WithMany()
            .HasForeignKey(a => a.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .Entity<EventMetricsDbModel>()
            .HasOne(m => m.Event)
            .WithMany()
            .HasForeignKey(m => m.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ActivityLogDbModel>().Property(a => a.Data).HasColumnType("jsonb");

        builder.Entity<EventMetricsDbModel>().Property(m => m.FeatureUsage).HasColumnType("jsonb");

        // guestAppConfig as json column (value converter)
        var dictionaryConverter = new ValueConverter<Dictionary<string, object>?, string?>(
            v => v == null ? null : JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
            v =>
                v == null
                    ? null
                    : JsonSerializer.Deserialize<Dictionary<string, object>>(
                        v,
                        (JsonSerializerOptions?)null
                    )
        );

        var dictionaryComparer = new ValueComparer<Dictionary<string, object>?>(
            (c1, c2) =>
                JsonSerializer.Serialize(c1, (JsonSerializerOptions?)null)
                == JsonSerializer.Serialize(c2, (JsonSerializerOptions?)null),
            c =>
                c == null
                    ? 0
                    : JsonSerializer.Serialize(c, (JsonSerializerOptions?)null).GetHashCode(),
            c =>
                c == null
                    ? null
                    : JsonSerializer.Deserialize<Dictionary<string, object>>(
                        JsonSerializer.Serialize(c, (JsonSerializerOptions?)null),
                        (JsonSerializerOptions?)null
                    )
        );

        builder
            .Entity<EventDbModel>()
            .Property(e => e.GuestAppConfig)
            .HasColumnType("jsonb")
            .HasConversion(dictionaryConverter)
            .Metadata.SetValueComparer(dictionaryComparer);

        // Theme configuration
        builder
            .Entity<ThemeDbModel>()
            .HasIndex(t => t.Name)
            .IsUnique()
            .HasDatabaseName("IX_Themes_Name");

        builder
            .Entity<ThemeDbModel>()
            .HasIndex(t => t.IsActive)
            .HasDatabaseName("IX_Themes_IsActive");

        builder
            .Entity<ThemeDbModel>()
            .Property(t => t.ThemeConfig)
            .HasColumnType("jsonb");

        builder
            .Entity<ThemeDbModel>()
            .Property(t => t.DarkParticleColors)
            .HasColumnType("jsonb");

        // EventTemplate configuration
        builder
            .Entity<EventTemplateDbModel>()
            .HasIndex(et => et.EventId)
            .IsUnique()
            .HasDatabaseName("IX_EventTemplates_EventId");

        builder
            .Entity<EventTemplateDbModel>()
            .HasOne(et => et.Event)
            .WithOne()
            .HasForeignKey<EventTemplateDbModel>(et => et.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .Entity<EventTemplateDbModel>()
            .HasOne(et => et.Theme)
            .WithMany()
            .HasForeignKey(et => et.ThemeId)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .Entity<EventTemplateDbModel>()
            .Property(et => et.ThemeConfig)
            .HasColumnType("jsonb");
    }
}
