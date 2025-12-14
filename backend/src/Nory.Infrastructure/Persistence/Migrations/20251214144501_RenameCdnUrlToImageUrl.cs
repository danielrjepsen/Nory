using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nory.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameCdnUrlToImageUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CdnUrl",
                table: "EventPhotos",
                newName: "ImageUrl");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "EventPhotos",
                newName: "CdnUrl");
        }
    }
}
