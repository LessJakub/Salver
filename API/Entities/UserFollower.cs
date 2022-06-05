using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    [Table("UserFollowers")]
    public class UserFollower
    {
        public int Id { get; set; }

        public int FollowerId { get; set; }

        public virtual AppUser Follower { get; set; }

        public virtual AppUser Followed { get; set; }

        public int FollowedId { get; set; }
    }
}