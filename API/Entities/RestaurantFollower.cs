using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("RestaurantFollowers")]
    public class RestaurantFollower
    {
        public int Id { get; set; }

        public int? FollowerId { get; set; }

        public virtual AppUser? Follower { get; set; }

        public virtual AppRestaurant? Followed { get; set; }

        public int? FollowedId { get; set; }
    }
}