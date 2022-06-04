using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class DishDto
    {
        public DishDto()
        {
        }

        public DishDto(Dish dish)
        {
            Id = dish.Id;
            Name = dish.Name;
            Description = dish.Description;
            Ingredients = dish.Ingredients;
            AppRestaurantId = dish.AppRestaurantId;
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public string Description { get; set; }

        public string Ingredients { get; set; }

        public int AppRestaurantId { get; set; }
        public int Price { get; set; }
        public float TasteGrade { get; set; } = 0.0f;
        public float PriceGrade { get; set; } = 0.0f;
        public float ServiceGrade { get; set; } = 0.0f;
    }
}