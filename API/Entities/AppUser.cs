using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
public enum Roles {
    User,
    Admin
};

    public class AppUser
    {
        
        public int Id { get; set; }

        public string UserName { get; set; }

        public int Verified { get; set; }

        public byte[] PasswordHash { get; set; }

        public byte[] PasswordSalt { get; set; }

        public Roles Role { get; set; }

        public ICollection<Restaurant_Owner> User_Res_Relation { get; set; }

        public ICollection<Post> Posts { get; set; }

        public ICollection<Order> Orders { get; set; }

        public ICollection<Follower> Followers { get; set; }

        public ICollection<Restaurant_Review> Res_Review { get; set; }
    }
}