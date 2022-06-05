using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class AddedReviewsToEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "AtmosphereRating",
                table: "Restaurants",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "ServiceRating",
                table: "Restaurants",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "PriceRating",
                table: "Dishes",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "ServiceRating",
                table: "Dishes",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "TasteRating",
                table: "Dishes",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AtmosphereRating",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "ServiceRating",
                table: "Restaurants");

            migrationBuilder.DropColumn(
                name: "PriceRating",
                table: "Dishes");

            migrationBuilder.DropColumn(
                name: "ServiceRating",
                table: "Dishes");

            migrationBuilder.DropColumn(
                name: "TasteRating",
                table: "Dishes");
        }
    }
}
