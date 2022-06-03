using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class DishesController : BaseAuthController
    {
        public DishesController(DataContext context) : base(context)
        {
        }

        /// <summary>
        /// Creates new restaurant dish
        /// </summary>
        /// <param name="restaurantId">Id of the restaurant</param>
        /// <param name="newDishDto">New dish parameters</param>
        /// <remarks>Status codes not documented</remarks>
        /// <returns>DishDto from created post</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpPost("Restaurants/{restaurantId}/dishes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<DishDto>> Create(int restaurantId, NewDishDto newDishDto)
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
        }



        /// <summary>
        /// Gets list of all dishes created under certain restaurant
        /// </summary>
        /// <param name="restaurantId">Id of the restaurant</param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns>List of DishDto created from restaurants dishes</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [AllowAnonymous]
        [HttpGet("Restaurants/{restaurantId}/dishes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<DishDto>>> ReadAll(int restaurantId)
        {
            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            if(restaurant == null) return BadRequest($"Restaurant with {restaurantId} id does not exist");

            var dishes = new List<DishDto>();
            foreach(var dish in restaurant.Dishes.ToList()) dishes.Add(new DishDto(dish));

            return dishes;
        }

        /// <summary>
        /// Updates selected dish of certain restaurant
        /// </summary>
        /// <param name="restaurantId">Id of the restaurant</param>
        /// <param name="newDishDto">Post parameters</param>
        /// <param name="dishId">Id of the post</param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns>Returns ReviewDto from created post</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpPut("Restaurants/{restaurantId}/dishes/{dishId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<DishDto>> Update(int restaurantId, int dishId, NewDishDto newDishDto)
        {
            var ownCheck = await OwnsRestaurant(restaurantId);
            if(ownCheck.Item1 != StatusCodes.Status200OK) return StatusCode(ownCheck.Item1, ownCheck.Item2);

            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            if(restaurant == null) return BadRequest($"Restaurant with {restaurantId} id does not exist");

            var dish = restaurant.Dishes.FirstOrDefault(r => r.Id == dishId);
            if(dish == null) return BadRequest($"Dish with {dishId} Id does not exist");

            dish.Name = newDishDto.Name;
            dish.Ingredients = newDishDto.Ingredients;
            dish.Description = newDishDto.Description;

            await context.SaveChangesAsync();

            return new DishDto(dish);
        }

        /// <summary>
        /// Delates selected post
        /// </summary>
        /// <param name="restaurantId"></param>
        /// <param name="dishId"></param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns></returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpDelete("Restaurants/{restaurantId}/dishes/{dishId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Delete(int restaurantId, int dishId)
        {
            var ownCheck = await OwnsRestaurant(restaurantId);
            if(ownCheck.Item1 != StatusCodes.Status200OK) return StatusCode(ownCheck.Item1, ownCheck.Item2);
            
            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            if(restaurant == null) return BadRequest($"Restaurant with {restaurantId} id does not exist");

            var dish = restaurant.Dishes.FirstOrDefault(r => r.Id == dishId);
            if(dish == null) return BadRequest($"Dish with {dishId} id does not exist");

            context.Remove(dish);

            await context.SaveChangesAsync();

            return Ok();
        }



        /// <summary>
        /// Search restaurants with specific name
        /// </summary>
        /// <param name="dishName">String containing search information</param>
        /// <remarks>
        /// Does not require authorization.
        /// Finds all restaurants containing search information. Not case sensitive. 
        /// Always returns status code 200 OK but may return empty list. 
        /// Currentlly accpets only name as parameter</remarks>
        /// <returns>list of RestaurantDtos</returns>
        /// <response code="200"> Returns list of restaurants with matching parameters</response>
        [AllowAnonymous]
        [HttpGet("search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IEnumerable<DishDto>> SearchRestaurant(string dishName)
        {
            var dishes = await context.Dishes.Where(e => e.Name.Contains(dishName)).ToListAsync();

            var restaurantsToReturn = new List<DishDto>();
            foreach(var dish in dishes)
            {
                restaurantsToReturn.Add(new DishDto(dish));
            }
            return restaurantsToReturn;
        }
    }
}