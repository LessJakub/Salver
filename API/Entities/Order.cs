using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public enum Status 
    {
        NEW,
        IN_PROGRESS,
        CANCELLED,
        FINISHED
    }

    [Table("Orders")]
    public class Order
    {
        public int Id { get; set; }

        public string Address { get; set; }

        public float TotalPrice { get; set; }

        public Status Status { get; set; }

        public DateTime SubmitTime { get; set; }

        public TimeSpan ExpectedTime { get; set; }

        public DateTime? RealizationTime { get; set; }

        public virtual AppUser AppUser { get; set; }

        public int AppUserId { get; set; }

        public virtual AppRestaurant AppRestaurant { get; set; }

        public int AppRestaurantId { get; set; }

        public virtual ICollection<DishInOrder> DishesInOrder { get; set; }
        
    }
}