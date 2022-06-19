using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class AddedSpamFunctionality : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "MarkedAsSpam",
                table: "Res_Review",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "SpamMarkedDate",
                table: "Res_Review",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "MarkedAsSpam",
                table: "Dish_Review",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "SpamMarkedDate",
                table: "Dish_Review",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MarkedAsSpam",
                table: "Res_Review");

            migrationBuilder.DropColumn(
                name: "SpamMarkedDate",
                table: "Res_Review");

            migrationBuilder.DropColumn(
                name: "MarkedAsSpam",
                table: "Dish_Review");

            migrationBuilder.DropColumn(
                name: "SpamMarkedDate",
                table: "Dish_Review");
        }
    }
}
