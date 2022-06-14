using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class ReviewDto
    {
        public ReviewDto()
        {
        }

        public ReviewDto(Restaurant_Review rev)
        {
            Id = rev.Id;
            Description = rev.Description;
            //Rating = rev.Rating;
            UserId = rev.AppUserId;
            AtmosphereRating = rev.AtmosphereRating;
            ServiceRating = rev.ServiceRating;
            RestaurantId = rev.AppRestaurantId;
            Date = rev.CreationDate;
        }

        public int Id { get; set; }
        public string Description { get; set; }
        public int AtmosphereRating { get; set; }
        public int ServiceRating { get; set; }

        public DateTime Date { get; set; }
        public int UserId { get; set; }

        public int RestaurantId { get; set; }
    }
}