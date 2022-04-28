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
            Rating = rev.Rating;
            UserId = rev.AppUserId;
        }

        public int Id { get; set; }
        public string Description { get; set; }
        public int Rating { get; set; }
        public int UserId { get; set; }
    }
}