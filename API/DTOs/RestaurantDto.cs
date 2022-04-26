using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class RestaurantDto
    {
        public RestaurantDto()
        {
        }

        public RestaurantDto(AppRestaurant appRestaurant)
        {
            Id = appRestaurant.Id;
            Name = appRestaurant.Name;
            Description = appRestaurant.Description;
            Address = appRestaurant.Description;
            Price = appRestaurant.Price;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public float Price { get; set; }
    }
}