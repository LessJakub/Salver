﻿// <auto-generated />
using System;
using API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace API.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20220607202756_AddedPhoneNumberToRestaurant")]
    partial class AddedPhoneNumberToRestaurant
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("API.Entities.AppRestaurant", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("AtmosphereRating")
                        .HasColumnType("real");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("Price")
                        .HasColumnType("real");

                    b.Property<float>("ServiceRating")
                        .HasColumnType("real");

                    b.HasKey("Id");

                    b.ToTable("Restaurants");
                });

            modelBuilder.Entity("API.Entities.AppUser", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<byte[]>("PasswordHash")
                        .HasColumnType("varbinary(max)");

                    b.Property<byte[]>("PasswordSalt")
                        .HasColumnType("varbinary(max)");

                    b.Property<int>("Role")
                        .HasColumnType("int");

                    b.Property<string>("UserName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Verified")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("API.Entities.Dish", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("AppRestaurantId")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Ingredients")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("Price")
                        .HasColumnType("real");

                    b.Property<float>("PriceRating")
                        .HasColumnType("real");

                    b.Property<float>("ServiceRating")
                        .HasColumnType("real");

                    b.Property<float>("TasteRating")
                        .HasColumnType("real");

                    b.HasKey("Id");

                    b.HasIndex("AppRestaurantId");

                    b.ToTable("Dishes");
                });

            modelBuilder.Entity("API.Entities.Dish_Review", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("AppUserId")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("DishId")
                        .HasColumnType("int");

                    b.Property<int>("PriceRating")
                        .HasColumnType("int");

                    b.Property<int>("ServiceRating")
                        .HasColumnType("int");

                    b.Property<int>("TasteRating")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AppUserId");

                    b.HasIndex("DishId");

                    b.ToTable("Dish_Review");
                });

            modelBuilder.Entity("API.Entities.DishInOrder", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("DishId")
                        .HasColumnType("int");

                    b.Property<int>("OrderId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("DishId");

                    b.HasIndex("OrderId");

                    b.ToTable("DishesInOrder");
                });

            modelBuilder.Entity("API.Entities.Order", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("AppRestaurantId")
                        .HasColumnType("int");

                    b.Property<int>("AppUserId")
                        .HasColumnType("int");

                    b.Property<float>("TotalPrice")
                        .HasColumnType("real");

                    b.HasKey("Id");

                    b.HasIndex("AppRestaurantId");

                    b.HasIndex("AppUserId");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("API.Entities.Post", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int?>("AppRestaurantId")
                        .HasColumnType("int");

                    b.Property<int?>("AppUserId")
                        .HasColumnType("int");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Likes")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AppRestaurantId");

                    b.HasIndex("AppUserId");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("API.Entities.Restaurant_Owner", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("AppRestaurantId")
                        .HasColumnType("int");

                    b.Property<int>("AppUserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AppRestaurantId");

                    b.HasIndex("AppUserId");

                    b.ToTable("User_Res_Relation");
                });

            modelBuilder.Entity("API.Entities.Restaurant_Review", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("AppRestaurantId")
                        .HasColumnType("int");

                    b.Property<int>("AppUserId")
                        .HasColumnType("int");

                    b.Property<int>("AtmosphereRating")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ServiceRating")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AppRestaurantId");

                    b.HasIndex("AppUserId");

                    b.ToTable("Res_Review");
                });

            modelBuilder.Entity("API.Entities.RestaurantFollower", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("FollowedId")
                        .HasColumnType("int");

                    b.Property<int>("FollowerId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("FollowedId");

                    b.HasIndex("FollowerId");

                    b.ToTable("RestaurantFollowers");
                });

            modelBuilder.Entity("API.Entities.UserFollower", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("FollowedId")
                        .HasColumnType("int");

                    b.Property<int>("FollowerId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("FollowedId");

                    b.HasIndex("FollowerId");

                    b.ToTable("UserFollowers");
                });

            modelBuilder.Entity("API.Entities.Dish", b =>
                {
                    b.HasOne("API.Entities.AppRestaurant", "AppRestaurant")
                        .WithMany("Dishes")
                        .HasForeignKey("AppRestaurantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AppRestaurant");
                });

            modelBuilder.Entity("API.Entities.Dish_Review", b =>
                {
                    b.HasOne("API.Entities.AppUser", "AppUser")
                        .WithMany()
                        .HasForeignKey("AppUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.Dish", "Dish")
                        .WithMany("Dish_Review")
                        .HasForeignKey("DishId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AppUser");

                    b.Navigation("Dish");
                });

            modelBuilder.Entity("API.Entities.DishInOrder", b =>
                {
                    b.HasOne("API.Entities.Dish", "Dish")
                        .WithMany("DishesInOrder")
                        .HasForeignKey("DishId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.Order", "Order")
                        .WithMany("DishesInOrder")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Dish");

                    b.Navigation("Order");
                });

            modelBuilder.Entity("API.Entities.Order", b =>
                {
                    b.HasOne("API.Entities.AppRestaurant", "AppRestaurant")
                        .WithMany("Orders")
                        .HasForeignKey("AppRestaurantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.AppUser", "AppUser")
                        .WithMany("Orders")
                        .HasForeignKey("AppUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AppRestaurant");

                    b.Navigation("AppUser");
                });

            modelBuilder.Entity("API.Entities.Post", b =>
                {
                    b.HasOne("API.Entities.AppRestaurant", "AppRestaurant")
                        .WithMany("Posts")
                        .HasForeignKey("AppRestaurantId");

                    b.HasOne("API.Entities.AppUser", "AppUser")
                        .WithMany("Posts")
                        .HasForeignKey("AppUserId");

                    b.Navigation("AppRestaurant");

                    b.Navigation("AppUser");
                });

            modelBuilder.Entity("API.Entities.Restaurant_Owner", b =>
                {
                    b.HasOne("API.Entities.AppRestaurant", "AppRestaurant")
                        .WithMany("User_Res_Relation")
                        .HasForeignKey("AppRestaurantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.AppUser", "AppUser")
                        .WithMany("User_Res_Relation")
                        .HasForeignKey("AppUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AppRestaurant");

                    b.Navigation("AppUser");
                });

            modelBuilder.Entity("API.Entities.Restaurant_Review", b =>
                {
                    b.HasOne("API.Entities.AppRestaurant", "AppRestaurant")
                        .WithMany("Res_Review")
                        .HasForeignKey("AppRestaurantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.AppUser", "AppUser")
                        .WithMany("Res_Review")
                        .HasForeignKey("AppUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AppRestaurant");

                    b.Navigation("AppUser");
                });

            modelBuilder.Entity("API.Entities.RestaurantFollower", b =>
                {
                    b.HasOne("API.Entities.AppRestaurant", "Followed")
                        .WithMany("Followers")
                        .HasForeignKey("FollowedId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("API.Entities.AppUser", "Follower")
                        .WithMany("FollowedRestaurants")
                        .HasForeignKey("FollowerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Followed");

                    b.Navigation("Follower");
                });

            modelBuilder.Entity("API.Entities.UserFollower", b =>
                {
                    b.HasOne("API.Entities.AppUser", "Followed")
                        .WithMany("UserFollowers")
                        .HasForeignKey("FollowedId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("API.Entities.AppUser", "Follower")
                        .WithMany("FollowedUsers")
                        .HasForeignKey("FollowerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Followed");

                    b.Navigation("Follower");
                });

            modelBuilder.Entity("API.Entities.AppRestaurant", b =>
                {
                    b.Navigation("Dishes");

                    b.Navigation("Followers");

                    b.Navigation("Orders");

                    b.Navigation("Posts");

                    b.Navigation("Res_Review");

                    b.Navigation("User_Res_Relation");
                });

            modelBuilder.Entity("API.Entities.AppUser", b =>
                {
                    b.Navigation("FollowedRestaurants");

                    b.Navigation("FollowedUsers");

                    b.Navigation("Orders");

                    b.Navigation("Posts");

                    b.Navigation("Res_Review");

                    b.Navigation("UserFollowers");

                    b.Navigation("User_Res_Relation");
                });

            modelBuilder.Entity("API.Entities.Dish", b =>
                {
                    b.Navigation("Dish_Review");

                    b.Navigation("DishesInOrder");
                });

            modelBuilder.Entity("API.Entities.Order", b =>
                {
                    b.Navigation("DishesInOrder");
                });
#pragma warning restore 612, 618
        }
    }
}
