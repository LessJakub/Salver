using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
     [Table("Res_Review")]
    public class Restaurant_Review
    {
        public int Id { get; set; }

        public int Rating{ get; set; }

        public string Description { get; set; }

        public AppRestaurant AppRestaurant { get; set; }

        public int AppRestaurantId { get; set; }

        public AppUser AppUser { get; set; }

        public int AppUserId { get; set; }
    }
}