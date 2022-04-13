using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Followers")]
    public class Follower
    {
        public int Id { get; set; }

        public int FollowerId { get; set; }

        public AppUser AppUser { get; set; }

        public int AppUserId { get; set; }

        public AppRestaurant AppRestaurant { get; set; }

        public int AppRestaurantId { get; set; }
    }
}