using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class ChnagedDishToNullableInOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DishesInOrder_Dishes_DishId",
                table: "DishesInOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantFollowers_Restaurants_FollowedId",
                table: "RestaurantFollowers");

            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantFollowers_Users_FollowerId",
                table: "RestaurantFollowers");

            migrationBuilder.AlterColumn<int>(
                name: "DishId",
                table: "DishesInOrder",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_DishesInOrder_Dishes_DishId",
                table: "DishesInOrder",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantFollowers_Restaurants_FollowedId",
                table: "RestaurantFollowers",
                column: "FollowedId",
                principalTable: "Restaurants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantFollowers_Users_FollowerId",
                table: "RestaurantFollowers",
                column: "FollowerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DishesInOrder_Dishes_DishId",
                table: "DishesInOrder");

            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantFollowers_Restaurants_FollowedId",
                table: "RestaurantFollowers");

            migrationBuilder.DropForeignKey(
                name: "FK_RestaurantFollowers_Users_FollowerId",
                table: "RestaurantFollowers");

            migrationBuilder.AlterColumn<int>(
                name: "DishId",
                table: "DishesInOrder",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_DishesInOrder_Dishes_DishId",
                table: "DishesInOrder",
                column: "DishId",
                principalTable: "Dishes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantFollowers_Restaurants_FollowedId",
                table: "RestaurantFollowers",
                column: "FollowedId",
                principalTable: "Restaurants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RestaurantFollowers_Users_FollowerId",
                table: "RestaurantFollowers",
                column: "FollowerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
