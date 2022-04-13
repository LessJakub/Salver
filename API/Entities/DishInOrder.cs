using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    [Table("DishesInOrder")]
    public class DishInOrder
    {
        public int Id { get; set; }

        public Order Order { get; set; }

        public int OrderId { get; set; }

        public Dish Dish { get; set; }

        public int DishId { get; set; }
    }
}