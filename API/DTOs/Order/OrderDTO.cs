using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public string Address { get; set; }
        public float TotalPrice { get; set; }
        public int UserId { get; set; }
        public int RestaurantId { get; set; }
        public int[] DishesIds { get; set; }
    }
}