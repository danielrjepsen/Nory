using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Nory.Infrastructure.Persistence.Models;

namespace Nory.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<UserDbModel, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    // entities
    public DbSet<EventDbModel> Events { get; set; }
    public DbSet<EventPhotoDbModel> EventPhotos { get; set; }
    public DbSet<EventCategoryDbModel> EventCategories { get; set; }
    public DbSet<EventAppDbModel> EventApps { get; set; }
    public DbSet<AppTypeDbModel> AppTypes { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<UserDbModel>().ToTable("Users");
        builder.Entity<EventDbModel>().ToTable("Events");
        builder.Entity<EventPhotoDbModel>().ToTable("EventPhotos");
        builder.Entity<EventCategoryDbModel>().ToTable("EventCategories");
        builder.Entity<EventAppDbModel>().ToTable("EventApps");
        builder.Entity<AppTypeDbModel>().ToTable("AppTypes");

        // indexes
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

        // relationships
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
            .Entity<EventDbModel>()
            .HasMany(e => e.EventApps)
            .WithOne(ea => ea.Event)
            .HasForeignKey(ea => ea.EventId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
