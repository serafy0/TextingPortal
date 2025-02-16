using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TextingBackendApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class update2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MessageLogs_MessageTemplates_MessageTemplateId",
                table: "MessageLogs");

            migrationBuilder.DropIndex(
                name: "IX_MessageLogs_MessageTemplateId",
                table: "MessageLogs");

            migrationBuilder.DropColumn(
                name: "MessageTemplateId",
                table: "MessageLogs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MessageTemplateId",
                table: "MessageLogs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_MessageLogs_MessageTemplateId",
                table: "MessageLogs",
                column: "MessageTemplateId");

            migrationBuilder.AddForeignKey(
                name: "FK_MessageLogs_MessageTemplates_MessageTemplateId",
                table: "MessageLogs",
                column: "MessageTemplateId",
                principalTable: "MessageTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
