using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Dish_Review")]
    public class Dish_Review
    {
        public int Id { get; set; }

        public int TasteRating { get; set; }
        public int PriceRating { get; set; }
        public int ServiceRating { get; set; }

        public string Description { get; set; }

        public virtual AppUser AppUser { get; set; }

        public int AppUserId { get; set; }

        public virtual Dish Dish { get; set; }

        public int DishId { get; set; }
    }
}