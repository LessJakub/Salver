using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserFollower>(entity => {
                entity.HasOne(hf => hf.Follower)
                .WithMany(h => h.FollowedUsers)
                .HasForeignKey(hf => hf.FollowerId)
                .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(hf => hf.Followed)
                .WithMany(h => h.UserFollowers)
                .HasForeignKey(hf => hf.FollowedId)
                .OnDelete(DeleteBehavior.Restrict);
                }
                );

            modelBuilder.Entity<RestaurantFollower>(entity => {
                entity.HasOne(hf => hf.Follower)
                .WithMany(h => h.FollowedRestaurants)
                .HasForeignKey(hf => hf.FollowerId)
                .OnDelete(DeleteBehavior.Restrict);
                
                entity.HasOne(hf => hf.Followed)
                .WithMany(h => h.Followers)
                .HasForeignKey(hf => hf.FollowedId)
                .OnDelete(DeleteBehavior.Restrict);
                }
                );
        }
        
        public DbSet<AppUser> Users { get; set; }

        public DbSet<AppRestaurant> Restaurants { get; set; }

        public DbSet<Restaurant_Review> RestaurantReviews { get; set; }

        public DbSet<Dish> Dishes { get; set; }
        public DbSet<Dish_Review> DishReviews { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<Post> Posts { get; set; }

        public DbSet<UserFollower> Follows { get; set; }
    }
}