namespace API.Entities
{
    public class AppRestaurant
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Address { get; set; }

        public float Price { get; set; }

        public virtual ICollection<Restaurant_Owner> User_Res_Relation  { get; set; }

        public virtual ICollection<Post> Posts { get; set; }

        public virtual ICollection<Restaurant_Review> Res_Review { get; set; }

        public virtual ICollection<RestaurantFollower> Followers { get; set; }

        public virtual ICollection<Order> Orders { get; set; }

        public virtual ICollection<Dish> Dishes { get; set; }

        public float AtmosphereRating{ get; set; }
        public float ServiceRating { get; set; }
    }
}