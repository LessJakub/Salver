using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class UserProfileDto
    {
        public UserProfileDto()
        {
        }

        public UserProfileDto(AppUser user)
        {
            Id = user.Id;
            Username = user.UserName;
            Verified = user.Verified;
            Followers = user.UserFollowers.Count();
            FollowedUsers = user.FollowedUsers.Count();
            FollowedRestaurants = user.FollowedRestaurants.Count();
        }

        public int Id { get; set; }
        public string Username { get; set; }
        public bool Verified { get; set; }

        public int Followers { get; set; } = 0;

        public int FollowedUsers { get; set; } = 0;

        public int FollowedRestaurants { get; set; } = 0;

    }
}