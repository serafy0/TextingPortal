using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TextingBackendApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MessageLogs_MessageTemplates_MessageTemplateId",
                table: "MessageLogs");

            migrationBuilder.AlterColumn<int>(
                name: "MessageTemplateId",
                table: "MessageLogs",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MessageLogs_MessageTemplates_MessageTemplateId",
                table: "MessageLogs",
                column: "MessageTemplateId",
                principalTable: "MessageTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MessageLogs_MessageTemplates_MessageTemplateId",
                table: "MessageLogs");

            migrationBuilder.AlterColumn<int>(
                name: "MessageTemplateId",
                table: "MessageLogs",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_MessageLogs_MessageTemplates_MessageTemplateId",
                table: "MessageLogs",
                column: "MessageTemplateId",
                principalTable: "MessageTemplates",
                principalColumn: "Id");
        }
    }
}
