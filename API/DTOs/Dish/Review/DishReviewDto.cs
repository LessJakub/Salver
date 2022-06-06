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
            TasteRating = dish_rev.TasteRating;
            PriceRating = dish_rev.PriceRating;
            ServiceRating = dish_rev.ServiceRating;
            Description = dish_rev.Description;
            UserId = dish_rev.AppUserId;
            DishId = dish_rev.DishId;
        }

        public int Id { get; set; }
        public int TasteRating { get; set; }
        public int PriceRating { get; set; }
        public int ServiceRating { get; set; }
        public string Description { get; set; }
        public int UserId { get; set; }
        public int DishId { get; set; }
    }
}