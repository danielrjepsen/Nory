using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nory.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddThemesAndEventTemplates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Themes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    PrimaryColor = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    SecondaryColor = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    AccentColor = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    BackgroundColor1 = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    BackgroundColor2 = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    BackgroundColor3 = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    TextPrimary = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    TextSecondary = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    TextAccent = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    PrimaryFont = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SecondaryFont = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ThemeConfig = table.Column<string>(type: "jsonb", nullable: true),
                    DarkBackgroundGradient = table.Column<string>(type: "text", nullable: true),
                    DarkParticleColors = table.Column<string>(type: "jsonb", nullable: true),
                    IsSystemTheme = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Themes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EventTemplates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EventId = table.Column<Guid>(type: "uuid", nullable: false),
                    ThemeName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ThemeId = table.Column<Guid>(type: "uuid", nullable: true),
                    PrimaryColor = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    SecondaryColor = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    AccentColor = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    BackgroundColor1 = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    BackgroundColor2 = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    BackgroundColor3 = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    PrimaryFont = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    SecondaryFont = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ThemeConfig = table.Column<string>(type: "jsonb", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventTemplates_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventTemplates_Themes_ThemeId",
                        column: x => x.ThemeId,
                        principalTable: "Themes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventTemplates_EventId",
                table: "EventTemplates",
                column: "EventId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EventTemplates_ThemeId",
                table: "EventTemplates",
                column: "ThemeId");

            migrationBuilder.CreateIndex(
                name: "IX_Themes_IsActive",
                table: "Themes",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Themes_Name",
                table: "Themes",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EventTemplates");

            migrationBuilder.DropTable(
                name: "Themes");
        }
    }
}
