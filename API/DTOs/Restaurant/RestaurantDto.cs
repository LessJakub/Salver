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
            Address = appRestaurant.Address;
            //Price = appRestaurant.Price;
            Followers = appRestaurant.Followers.Count();
            PhoneNumber = appRestaurant.PhoneNumber;
            Email = appRestaurant.Email;
            if(appRestaurant.Dishes.Count() > 0) 
            {
                MinPrice = appRestaurant.Dishes.Min(d => d.Price);
                MaxPrice = appRestaurant.Dishes.Max(d => d.Price);
                //PriceRange = (MinPrice != MaxPrice)?($"{MinPrice}-{MaxPrice}"):(null);
                Price = appRestaurant.Dishes.Average(d => d.Price);
            }
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string? Address { get; set; } = null;

        public string? PhoneNumber { get; set; } = null;

        public string? Email { get; set; } = null;
        public int Followers { get; set; } = 0;
        public float AtmosphereRating { get; set; } = 0.0f;
        public float ServiceRating { get; set; } = 0.0f;
        public float MinPrice { get; set; } = 0.0f;
        public float MaxPrice { get; set; } = 0.0f;

        public float Price { get; set; }
    }
}