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
        [Authorize(Roles = "RestaurantOwner")]
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
                AppRestaurant = restaurant,
                Price = newDishDto.Price
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
        /// Get one specific dish
        /// </summary>
        /// <param name="id">Id of the dish</param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns>DishDTO from requested dish</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [AllowAnonymous]
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<DishDto>> Read(int id)
        {
            var dish = await context.Dishes.FindAsync(id);
            if(dish == null) return BadRequest($"Dish with {id} id does not exist");

            return new DishDto(dish);
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
        [Authorize(Roles = "RestaurantOwner")]
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
            dish.Price = newDishDto.Price;

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
        [Authorize(Roles = "RestaurantOwner")]
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
        /// Search dish with specific name
        /// </summary>
        /// <param name="dishName">String containing search information</param>
        /// <param name="startingIndex"></param>
        /// <param name="endIndex"></param>
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
        public async Task<IEnumerable<DishDto>> SearchDish(string dishName, int startingIndex = 0, int endIndex = 12)
        {
            if(String.IsNullOrEmpty(dishName))
            {
                var dishesAll= new List<DishDto>();
                foreach(var dish in await context.Dishes.
                    OrderByDescending(dish => (dish.PriceRating + dish.ServiceRating + dish.TasteRating)/3.0  ).
                    Skip(startingIndex).
                    Take(endIndex).
                    ToListAsync())
                {
                    dishesAll.Add(new DishDto(dish));
                }
                
                return dishesAll;
            }

            var dishes = await context.Dishes.
                Where(e => e.Name.Contains(dishName)).
                OrderByDescending(dish => (dish.PriceRating + dish.ServiceRating + dish.TasteRating)/3.0).
                Skip(startingIndex).
                Take(endIndex).
                ToListAsync();

            var dishesToReturn = new List<DishDto>();
            foreach(var dish in dishes)
            {
                dishesToReturn.Add(new DishDto(dish));
            }
            return dishesToReturn;
        }
    }
}