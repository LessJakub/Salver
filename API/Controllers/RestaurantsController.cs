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
    public class RestaurantsController : BaseAuthController
    {
        public RestaurantsController(DataContext context) : base(context)
        {
        }

        /// <summary>
        /// Registers new restaurant.
        /// </summary>
        /// <param name="restaurantRegisterDto">Registration information</param>
        /// <remarks>Requires a logged in user</remarks>
        /// <returns>Public information of the restaurant</returns>
        /// <response code="200"> Ok, new restaurant is created. </response>
        /// <response code="204"> NoContent, id in users token is invalid. </response>
        /// <response code="400"> Bad request, invalid input. </response>
        [Authorize]
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<RestaurantDto>> Register(RestaurantRegisterDto restaurantRegisterDto)
        {
            var requesterId = GetRequesterId();
            if(requesterId < 0) return BadRequest();

            var user = await context.Users.FindAsync(requesterId);
        
            if(user == null) return NoContent();

            var restaurant = new AppRestaurant
            {
                Name = restaurantRegisterDto.Name,
                Description = restaurantRegisterDto.Description,
                Address = restaurantRegisterDto.Address,
                Price = 0.0f
            };

            var relation = new Restaurant_Owner{
                AppRestaurant = restaurant,
                AppRestaurantId = restaurant.Id,
                AppUser = user,
                AppUserId = user.Id
            };

            user.User_Res_Relation = new List<Restaurant_Owner>(){
                relation
            };

            restaurant.User_Res_Relation = new List<Restaurant_Owner>(){
                relation
            };

            context.Restaurants.Add(restaurant);

            await context.SaveChangesAsync();


            return new RestaurantDto(restaurant);
        }


        /// <summary>
        /// Get public information of restaurant with id
        /// </summary>
        /// <param name="id">Id of the restaurant</param>
        /// <remarks>Does not require authorization</remarks>
        /// <returns>Public information of the restaurant as RestaurantDto</returns>
        /// <response code="200"> Ok, restaurant is returned. </response>
        /// <response code="204"> NoContent, there is no restaurant with id. </response>
        /// <response code="400"> Bad request, invalid input. </response>
        [AllowAnonymous]
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<RestaurantDto>> GetRestaurant(int id)
        {
            var restaurant = await context.Restaurants.FindAsync(id);

            if(restaurant == null) return NoContent();

            return new RestaurantDto(restaurant);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200"></response>
        /// <response code="204"></response>
        /// <response code="400"></response>
        [AllowAnonymous]
        [HttpGet("{id}/follow")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> FollowRestaurant(int id)
        {
            var restaurant = await context.Restaurants.FindAsync(id);
            if(restaurant == null) return NoContent();

            var reqId = GetRequesterId();
            if(id == -1) return BadRequest($"You must be signed in to follow someone");

            //Can be optimized
            //Look for follow with AppUser != null && AppRestaurant == null
            var follow = new Follower {
              FollowerId = reqId,
              AppUser = null,
              AppUserId = 0,
              AppRestaurant = restaurant,
              AppRestaurantId = id
            };

            context.Add(follow);
            await context.SaveChangesAsync();
            
            return Ok();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200"> </response>
        /// <response code="204">  </response>
        /// <response code="400">  </response>
        [AllowAnonymous]
        [HttpDelete("{id}/unfollow")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> UnfollowRestaurant(int id)
        {
            var reqId = GetRequesterId();
            if(id == -1) return BadRequest($"You must be signed in to unfollow someone");

            var user = await context.Users.FindAsync(reqId);
            if(user is null) return NoContent();

            var follow = user.Followers.FirstOrDefault(f => f.AppRestaurantId == id);
            if(follow is null) return BadRequest($"You are not following restaurant with id {id}");

            context.Remove(follow);
            await context.SaveChangesAsync();
            
            return Ok();
        }


        #if DEBUG
        /// <summary>
        /// Get all restaurants, TESTING ONLY, CAN BE USED ONLY IN DEBUG
        /// </summary>
        /// <remarks>ONLY FOR TESTING, DO NOT IMPLEMENT IN FRONTEND</remarks>
        /// <returns>All information of all restaurants as AppRestaurant</returns>
        /// <response code="200"> Ok, restaurant is returned. </response>
        /// <response code="400"> Bad request, invalid input. </response>
        [AllowAnonymous]
        [HttpGet("all-restaurants-debug")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IEnumerable<AppRestaurant>> GetRestaurantsDebug()
        {
            return await context.Restaurants.ToListAsync();
        }
        #endif

        /// <summary>
        /// Get all restaurants
        /// </summary>
        /// <remarks>
        /// Does not require authorization.
        /// This returns list of all restaurants in DB, in future should be replaced with top 10 or something
        /// </remarks>
        /// <returns>Public information of all restaurants as RestaurantDto</returns>
        /// <response code="200"> Ok, restaurant is returned. </response>
        /// <response code="400"> Bad request, invalid input. </response>
        [AllowAnonymous]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IEnumerable<RestaurantDto>> GetRestaurants()
        {
            var restaurants = await context.Restaurants.ToListAsync();
            var restaurantsToReturn = new List<RestaurantDto>();
            foreach(var res in restaurants)
            {
                restaurantsToReturn.Add(new RestaurantDto(res));
            }
            return restaurantsToReturn;
        }

        /// <summary>
        /// Updates restaurant.
        /// </summary>
        /// <param name="id">Id of the restaurant</param>
        /// <param name="restaurantUpdateDto">Registration information</param>
        /// <remarks></remarks>
        /// <returns>Public information of the restaurant</returns>
        /// <response code="200"> Ok, new restaurant is created. </response>
        /// <response code="204"> NoContent, id in users token is invalid. </response>
        /// <response code="400"> Bad request, invalid input. </response>
        [Authorize]
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<RestaurantDto>> UpdateRestaurant(int id, RestaurantUpdateDto restaurantUpdateDto)
        {
            var restaurant = await context.Restaurants.FindAsync(id);
            if(restaurant == null) return NoContent();


            System.Console.Write(restaurant.User_Res_Relation);

            //Create list by finding ids in table.
            var owner = restaurant.User_Res_Relation.SingleOrDefault(relation => relation.AppUserId == GetRequesterId());
            if(owner == default) return Unauthorized();

            restaurant.Name = restaurantUpdateDto.Name;
            restaurant.Description = restaurantUpdateDto.Description;
            restaurant.Address = restaurantUpdateDto.Address;

            await context.SaveChangesAsync();

            return new RestaurantDto(restaurant);
        }

        /// <summary>
        /// Delete existing restaurant.
        /// </summary>
        /// <param name="id">Id of the restaurant</param>
        /// <remarks></remarks>
        /// <returns>Public information of the restaurant</returns>
        /// <response code="200"> Ok, new restaurant is created. </response>
        /// <response code="204"> NoContent, id in users token is invalid. </response>
        /// <response code="400"> Bad request, invalid input. </response>
        [Authorize]
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteRestaurant(int id)
        {
            var restaurant = await context.Restaurants.FindAsync(id);
            if(restaurant == null) return NoContent();

            var owner = restaurant.User_Res_Relation.FirstOrDefault(relation => relation.AppUserId == GetRequesterId());

            var adminCheckStatusCode = AuthorizedByRole(Roles.Admin.ToString());
            if(owner == null && adminCheckStatusCode != StatusCodes.Status200OK) return Unauthorized("User is not an admin or does not own the restaurant");

            context.Remove(restaurant);

            await context.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// Search restaurants with specific name
        /// </summary>
        /// <param name="restaurantName">String containing search information</param>
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
        public async Task<IEnumerable<RestaurantDto>> SearchRestaurant(string restaurantName)
        {
            if(String.IsNullOrEmpty(restaurantName)){
                return await this.GetRestaurants();
            }


            var restaurants = await context.Restaurants.Where(e => e.Name.Contains(restaurantName)).ToListAsync();

            var restaurantsToReturn = new List<RestaurantDto>();
            foreach(var res in restaurants)
            {
                restaurantsToReturn.Add(new RestaurantDto(res));
            }
            return restaurantsToReturn;
        }
        
    }
}