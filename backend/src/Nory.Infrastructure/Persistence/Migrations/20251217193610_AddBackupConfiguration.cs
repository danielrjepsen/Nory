using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nory.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddBackupConfiguration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BackupConfigurations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    Provider = table.Column<int>(type: "integer", nullable: false),
                    Schedule = table.Column<int>(type: "integer", nullable: false),
                    FolderName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    FolderId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ServiceAccountEmail = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    EncryptedCredentials = table.Column<string>(type: "text", nullable: true),
                    LastBackupAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastBackupStatus = table.Column<int>(type: "integer", nullable: false),
                    LastBackupError = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    TotalFilesBackedUp = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BackupConfigurations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BackupHistory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BackupConfigurationId = table.Column<Guid>(type: "uuid", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    FilesProcessed = table.Column<int>(type: "integer", nullable: false),
                    FilesUploaded = table.Column<int>(type: "integer", nullable: false),
                    FilesSkipped = table.Column<int>(type: "integer", nullable: false),
                    FilesFailed = table.Column<int>(type: "integer", nullable: false),
                    TotalBytesUploaded = table.Column<long>(type: "bigint", nullable: false),
                    ErrorMessage = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ErrorDetails = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BackupHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BackupHistory_BackupConfigurations_BackupConfigurationId",
                        column: x => x.BackupConfigurationId,
                        principalTable: "BackupConfigurations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BackupHistory_BackupConfigurationId",
                table: "BackupHistory",
                column: "BackupConfigurationId");

            migrationBuilder.CreateIndex(
                name: "IX_BackupHistory_StartedAt",
                table: "BackupHistory",
                column: "StartedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BackupHistory");

            migrationBuilder.DropTable(
                name: "BackupConfigurations");
        }
    }
}
