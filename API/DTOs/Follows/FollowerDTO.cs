using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class FollowerDTO
    {
        public FollowerDTO()
        {
        }

        public FollowerDTO(RestaurantFollower follower)
        {
            Id = follower.FollowerId;
            Name = follower.Follower.UserName;
        }

        public FollowerDTO(UserFollower follower)
        {
            Id = follower.FollowedId;
            Name = follower.Followed.UserName;
        }

        public int Id { get; set; }
        public string Name { get; set; }
    }
}