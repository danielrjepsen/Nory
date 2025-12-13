using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nory.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddGuestAppConfigToEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Events",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text"
            );

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Events",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "GuestAppConfig",
                table: "Events",
                type: "jsonb",
                nullable: true
            );

            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "Events",
                type: "boolean",
                nullable: false,
                defaultValue: false
            );

            migrationBuilder.AddColumn<string>(
                name: "ThemeName",
                table: "Events",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true
            );

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Events",
                type: "character varying(450)",
                maxLength: 450,
                nullable: false,
                defaultValue: ""
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "GuestAppConfig", table: "Events");

            migrationBuilder.DropColumn(name: "IsPublic", table: "Events");

            migrationBuilder.DropColumn(name: "ThemeName", table: "Events");

            migrationBuilder.DropColumn(name: "UserId", table: "Events");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Events",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200
            );

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Events",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000,
                oldNullable: true
            );
        }
    }
}
