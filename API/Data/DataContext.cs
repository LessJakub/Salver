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
                entity.HasOne(hf => hf.Followed)
                .WithMany(h => h.FollowedUsers)
                .HasForeignKey(hf => hf.FollowedId)
                .OnDelete(DeleteBehavior.Restrict);
                });
        }
        
        public DbSet<AppUser> Users { get; set; }

        public DbSet<AppRestaurant> Restaurants { get; set; }

        public DbSet<Dish> Dishes { get; set; }

        public DbSet<Order> Orders { get; set; }
    }
}