using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nory.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryIdToEventPhotos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventPhotos_EventCategories_EventCategoryDbModelId",
                table: "EventPhotos");

            migrationBuilder.RenameColumn(
                name: "EventCategoryDbModelId",
                table: "EventPhotos",
                newName: "CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_EventPhotos_EventCategoryDbModelId",
                table: "EventPhotos",
                newName: "IX_EventPhotos_CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventPhotos_EventCategories_CategoryId",
                table: "EventPhotos",
                column: "CategoryId",
                principalTable: "EventCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventPhotos_EventCategories_CategoryId",
                table: "EventPhotos");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "EventPhotos",
                newName: "EventCategoryDbModelId");

            migrationBuilder.RenameIndex(
                name: "IX_EventPhotos_CategoryId",
                table: "EventPhotos",
                newName: "IX_EventPhotos_EventCategoryDbModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventPhotos_EventCategories_EventCategoryDbModelId",
                table: "EventPhotos",
                column: "EventCategoryDbModelId",
                principalTable: "EventCategories",
                principalColumn: "Id");
        }
    }
}
