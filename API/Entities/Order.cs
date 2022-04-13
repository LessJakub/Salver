using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Orders")]
    public class Order
    {
        public int Id { get; set; }

        public string Address { get; set; }

        public float TotalPrice { get; set; }

        public AppUser AppUser { get; set; }

        public int AppUserId { get; set; }

        public AppRestaurant AppRestaurant { get; set; }

        public int AppRestaurantId { get; set; }

        public ICollection<DishInOrder> DishesInOrder { get; set; }
        
    }
}