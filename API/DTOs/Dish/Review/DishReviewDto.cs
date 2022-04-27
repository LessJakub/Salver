using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class DishReviewDto
    {
        public DishReviewDto()
        {
        }

        public DishReviewDto(Dish_Review dish_rev)
        {
            Id = dish_rev.Id;
            Rating = dish_rev.Rating;
            Description = dish_rev.Description;
            UserId = dish_rev.AppUserId;
            DishId = dish_rev.DishId;
        }

        public int Id { get; set; }
        public int Rating { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; }
        public int DishId { get; set; }
    }
}