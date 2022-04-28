using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("User_Res_Relation")]
    public class Restaurant_Owner
    {
        public int Id { get; set; }

        public virtual AppRestaurant AppRestaurant { get; set; }

        public int AppRestaurantId { get; set; }

        public virtual AppUser AppUser { get; set; }

        public int AppUserId { get; set; }
    }
}