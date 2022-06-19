using API.Entities;

namespace API.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; }

        public string Token { get; set; }
        
        //public ICollection<RestaurantDto> UsersRestaurants { get; set; } = new List<RestaurantDto>();
        public int IsRestaurantOwner { get; set; } = 0;
    }
}