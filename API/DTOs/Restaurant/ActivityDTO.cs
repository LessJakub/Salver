using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public enum ActivityType {
        DISH_REVIEW,
        RESTAURANT_REVIEW,
        RESTAURANT_POST,
        USET_POST
    }
    public class ActivityDTO
    {
        public ActivityDTO()
        {
        }

        public ActivityDTO(Dish_Review review)
        {
            Id = review.Id;
            Type = ActivityType.DISH_REVIEW;
            Ratings = new List<Tuple<string, int>>();
            Ratings.Add(new Tuple<string, int>("Price Rating", review.PriceRating));
            Ratings.Add(new Tuple<string, int>("Service Rating", review.ServiceRating));
            Ratings.Add(new Tuple<string, int>("Taste Rating", review.TasteRating));
            Date = review.CreationDate;
            Description = review.Description;
            CreatorId = review.AppUserId;
            TopicId = review.DishId;
        }



        public ActivityDTO(Restaurant_Review review)
        {
            Id = review.Id;
            Type = ActivityType.RESTAURANT_REVIEW;
            Ratings = new List<Tuple<string, int>>();
            Ratings.Add(new Tuple<string, int>("Atmosphere Rating", review.AtmosphereRating));
            Ratings.Add(new Tuple<string, int>("Service Rating", review.ServiceRating));
            Date = review.CreationDate;
            Description = review.Description;
            CreatorId = review.AppUserId;
            TopicId = review.AppRestaurantId;
        }

        public ActivityDTO(Post post)
        {
            Id = post.Id;
            Type = ActivityType.RESTAURANT_POST;
            Date = post.Date;
            Description = post.Description;
            CreatorId = (int)post.AppRestaurantId;
            Likes = post.Likes;
        }

        public int Id { get; set; }

        public ActivityType Type { get; set; }

        public List<Tuple<string, int>>? Ratings { get; set; } = null;

        public DateTime Date { get; set; }

        public string Description { get; set; }

        public int? Likes { get; set; } = null;

        public int CreatorId { get; set; }

        public int? TopicId { get; set; } = null;
    }
}