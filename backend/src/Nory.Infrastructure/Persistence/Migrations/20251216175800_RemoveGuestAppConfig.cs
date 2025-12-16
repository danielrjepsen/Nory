using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nory.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveGuestAppConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Migrate GuestAppConfig components to EventApps table
            migrationBuilder.Sql("""
                INSERT INTO "EventApps" ("Id", "EventId", "AppTypeId", "Configuration", "IsEnabled", "SortOrder", "CreatedAt", "UpdatedAt")
                SELECT
                    COALESCE(
                        (comp->>'id')::uuid,
                        gen_random_uuid()
                    ) as "Id",
                    e."Id" as "EventId",
                    CASE (comp->'config'->>'type')
                        WHEN 'remote' THEN 'tv-remote'
                        WHEN 'gallery' THEN 'photos'
                        ELSE COALESCE(comp->'config'->>'type', 'unknown')
                    END as "AppTypeId",
                    (comp->'config')::text as "Configuration",
                    true as "IsEnabled",
                    (comp->>'slot')::int as "SortOrder",
                    NOW() as "CreatedAt",
                    NOW() as "UpdatedAt"
                FROM "Events" e,
                     jsonb_array_elements(e."GuestAppConfig"->'components') as comp
                WHERE e."GuestAppConfig" IS NOT NULL
                  AND e."GuestAppConfig"->'components' IS NOT NULL
                ON CONFLICT ("Id") DO NOTHING;
                """);

            migrationBuilder.DropColumn(
                name: "GuestAppConfig",
                table: "Events");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GuestAppConfig",
                table: "Events",
                type: "jsonb",
                nullable: true);
        }
    }
}
