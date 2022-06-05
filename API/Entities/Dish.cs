using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("Dishes")]
    public class Dish
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Ingredients { get; set; }

        public float Price { get; set; }

        public virtual AppRestaurant AppRestaurant { get; set; }

        public int AppRestaurantId { get; set; }

        public virtual ICollection<DishInOrder> DishesInOrder { get; set; }

        public virtual ICollection<Dish_Review> Dish_Review { get; set; }

        public float TasteRating { get; set; }
        public float PriceRating { get; set; }
        public float ServiceRating { get; set; }
    }
}