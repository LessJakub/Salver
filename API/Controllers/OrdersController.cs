using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class OrdersController : BaseAuthController
    {
        public OrdersController(DataContext context) : base(context)
        {
        }

        /*
        /// <summary>
        /// 
        /// </summary>
        /// <param name="newOrderDTO"></param>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<OrderDTO>> Create(NewOrderDTO newOrderDTO)
        {
            
            var userId = GetRequesterId();
            var user = await context.Users.FindAsync(userId);
            if(user == null) return Unauthorized($"User with {userId} id does not exist");

            var ownCheck = await OwnsRestaurant(restaurantId);
            if(ownCheck.Item1 != StatusCodes.Status200OK) return StatusCode(ownCheck.Item1, ownCheck.Item2);

            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            if(restaurant == null) return BadRequest($"Restaurant with {restaurantId} id does not exist");

            
            
            var dish = new Dish{
                Name = newDishDto.Name,
                Ingredients = newDishDto.Ingredients,
                Description = newDishDto.Description,
                AppRestaurantId = restaurantId,
                AppRestaurant = restaurant
            };

            context.Add(dish);
            await context.SaveChangesAsync();

            return new DishDto(dish);
            
        }*/
    }
}