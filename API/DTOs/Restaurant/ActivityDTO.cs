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
        RESTAURANT_POST
    }
    public class ActivityDTO
    {
        public ActivityDTO(Dish_Review review)
        {
            Activity = new Tuple<int, ActivityType>(review.Id, ActivityType.DISH_REVIEW);
        }

        public ActivityDTO(Restaurant_Review review)
        {
            Activity = new Tuple<int, ActivityType>(review.Id, ActivityType.RESTAURANT_REVIEW);
        }

        public ActivityDTO(Post post)
        {
            Activity = new Tuple<int, ActivityType>(post.Id, ActivityType.RESTAURANT_POST);
        }

        public Tuple<int, ActivityType> Activity { get; private set; }
    }
}