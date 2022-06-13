using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class PostDto
    {
        public PostDto()
        {
        }

        public PostDto(Post post)
        {
            Id = post.Id;
            Name = post.AppRestaurant.Name;
            Date = post.Date;
            Likes = post.Likes;
            Description = post.Description;
            AppUserId = post.AppUserId;
            AppRestaurantId = post.AppRestaurantId;
        }

        public int Id { get; set; }

        public string Name { get; set; }
        public DateTime Date { get; set; }
        public int Likes { get; set; }
        public string Description { get; set; }
        public int? AppUserId { get; set; }
        public int? AppRestaurantId { get; set; }
    }
}