using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class OrderDTO
    {
        public OrderDTO()
        {
        }

        public OrderDTO(Order order)
        {
            this.Id = order.Id;
            this.Address = order.Address;
            this.TotalPrice = order.TotalPrice;
            this.UserId = order.AppUserId;
            this.RestaurantId = order.AppRestaurantId;
            DishesIds = new List<int>();
            foreach(var d in order.DishesInOrder)
            {
               DishesIds.Add(d.DishId);
            }
        }

        public int Id { get; set; }
        public string Address { get; set; }
        public float TotalPrice { get; set; }
        public int UserId { get; set; }
        public int RestaurantId { get; set; }
        public ICollection<int> DishesIds { get; set; }
    }
}