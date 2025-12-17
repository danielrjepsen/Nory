using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nory.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddMetricsNewColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TotalConsentUpdates",
                table: "EventMetrics",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalGuestRegistrations",
                table: "EventMetrics",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalGuestbookEntries",
                table: "EventMetrics",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalConsentUpdates",
                table: "EventMetrics");

            migrationBuilder.DropColumn(
                name: "TotalGuestRegistrations",
                table: "EventMetrics");

            migrationBuilder.DropColumn(
                name: "TotalGuestbookEntries",
                table: "EventMetrics");
        }
    }
}
