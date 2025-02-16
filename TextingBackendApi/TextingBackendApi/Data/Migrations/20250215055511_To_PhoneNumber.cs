using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TextingBackendApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class To_PhoneNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "To",
                table: "TwilioMessages",
                type: "nvarchar(13)",
                maxLength: 13,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "To",
                table: "TwilioMessages");
        }
    }
}
