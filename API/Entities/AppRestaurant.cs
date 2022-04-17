namespace API.Entities
{
    public class AppRestaurant
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Address { get; set; }

        public float Price { get; set; }

        public ICollection<Restaurant_Owner> User_Res_Relation { get; set; }

        public ICollection<Post> Posts { get; set; }

        public ICollection<Restaurant_Review> Res_Review { get; set; }

        public ICollection<Follower> Followers { get; set; }

        public ICollection<Order> Orders { get; set; }

        public ICollection<Dish> Dishes { get; set; }

        
    }
}