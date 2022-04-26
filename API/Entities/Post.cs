using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Posts")]
    public class Post
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public int Likes { get; set; }

        public string Description{ get; set; }

        public virtual AppUser? AppUser { get; set; }

        public int? AppUserId { get; set; }

        public virtual AppRestaurant? AppRestaurant { get; set; }

        public int? AppRestaurantId { get; set; }
    }
}