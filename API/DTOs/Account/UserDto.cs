using API.Entities;

namespace API.DTOs
{
    public class UserDto
    {
        public string Username { get; set; }

        public string Token { get; set; }
        
        //public ICollection<RestaurantDto> UsersRestaurants { get; set; } = new List<RestaurantDto>();
        public bool IsRestaurantOwner { get; set; } = false;
    }
}