using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
public enum Roles {
    User,
    Admin
};

    public class AppUser
    {
        
        public int Id { get; set; }

        public string UserName { get; set; }

        public bool Verified { get; set; }

        public byte[] PasswordHash { get; set; }

        public byte[] PasswordSalt { get; set; }

        public Roles Role { get; set; }

        public virtual ICollection<Restaurant_Owner> User_Res_Relation { get; set; }

        public virtual ICollection<Post> Posts { get; set; }

        public virtual ICollection<Order> Orders { get; set; }

        public virtual ICollection<RestaurantFollower> FollowedRestaurants { get; set; }
        
        public virtual ICollection<UserFollower> FollowedUsers { get; set; }

        public virtual ICollection<UserFollower> UserFollowers { get; set; }

        public virtual ICollection<Restaurant_Review> Res_Review { get; set; }

        public virtual ICollection<Dish_Review> Dish_Review { get; set; }
    }
}