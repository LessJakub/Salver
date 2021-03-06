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
        [Authorize(Roles = "Customer")]
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<RestaurantDto>> Register(RestaurantRegisterDto restaurantRegisterDto)
        {
            var requesterId = GetRequesterId();
            if(requesterId < 0) return BadRequest($"You must be sign in to create restaurant.");

            var user = await context.Users.FindAsync(requesterId);
        
            if(user == null) return BadRequest($"There is no user with id {requesterId}.");

            if(user.User_Res_Relation.Count() > 0) return BadRequest($"User with id {requesterId} already owns restaurant.");

            var restaurant = new AppRestaurant
            {
                Name = restaurantRegisterDto.Name,
                Description = restaurantRegisterDto.Description,
                Address = restaurantRegisterDto.Address,
                PhoneNumber = restaurantRegisterDto.PhoneNumber,
                Email = restaurantRegisterDto.Email
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

            if(restaurant == null) return BadRequest($"There is no restaurant with id {id}");

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
        [Authorize(Roles = "Customer")]
        [HttpGet("{id}/follow")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> FollowRestaurant(int id)
        {
            var restaurant = await context.Restaurants.FirstOrDefaultAsync(r => r.Id == id);
            if(restaurant is null) return BadRequest($"Restaurant with id {id} does not exist");

            var reqId = GetRequesterId();
            if(reqId == -1) return BadRequest($"You must be signed in to follow someone");

            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == reqId);
            if(user is null) return BadRequest($"User with id {reqId} does not exist");

            var prevFollow = user.FollowedRestaurants.FirstOrDefault(p => p.FollowedId == id);
            if(prevFollow is not null) return BadRequest($"User with id {reqId} already follows restaurant with id {id}");

            var follow = new RestaurantFollower {
                FollowerId = reqId,
                Follower = user,
                Followed = restaurant,
                FollowedId = id
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

            var follow = user.FollowedRestaurants.FirstOrDefault(f => f.FollowedId == id);
            if(follow is null) return BadRequest($"You are not following restaurant with id {id}");

            context.Remove(follow);
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
        [HttpGet("{id}/followers")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<FollowerDTO>>> GetFollowersOfRestaurant(int id)
        {
            var restaurant = await context.Restaurants.FirstOrDefaultAsync(r => r.Id == id);
            if(restaurant is null) return BadRequest($"Restaurant with id {id} does not exist.");


            var listToRet = new List<FollowerDTO>();
            foreach(var f in restaurant.Followers.ToList())
            {
                listToRet.Add(new FollowerDTO(f));
            }
            
            return listToRet;
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
        [Authorize(Roles = "RestaurantOwner")]
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
            restaurant.Email = restaurantUpdateDto.Email;
            restaurant.PhoneNumber = restaurantUpdateDto.PhoneNumber;

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
        [Authorize(Roles = "RestaurantOwner")]
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

            foreach(var o in restaurant.Orders.ToList())
            {
                foreach(var dio in o.DishesInOrder.ToList())
                {
                    dio.Dish = null;
                    dio.DishId = 0;
                }
            }

            foreach(var f in restaurant.Followers.ToList())
            {
                f.Follower = null;
                f.FollowerId = 0;
                f.Followed = null;
                f.FollowedId = 0;
                context.Remove(f);
            }

            context.Remove(restaurant);

            await context.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// Search restaurants with specific name
        /// </summary>
        /// <param name="restaurantName">String containing search information</param>
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
        public async Task<IEnumerable<RestaurantDto>> SearchRestaurant(string restaurantName, int startingIndex=0, int endIndex=12)
        {
            if(String.IsNullOrEmpty(restaurantName)){
                var list = await this.GetRestaurants();
                return list.
                    OrderByDescending(res => res.Followers).
                    Skip(startingIndex).
                    Take(endIndex).
                    ToList();
            }


            var restaurants = await context.Restaurants.
                Where(e => e.Name.Contains(restaurantName)).
                OrderByDescending(res => res.Followers.Count()).
                Skip(startingIndex).
                Take(endIndex).
                ToListAsync();


            var restaurantsToReturn = new List<RestaurantDto>();
            foreach(var res in restaurants)
            {
                restaurantsToReturn.Add(new RestaurantDto(res));
            }
            return restaurantsToReturn;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="startingIndex"></param>
        /// <param name="endIndex"></param>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200"></response>
        /// <response code="204"></response>
        /// <response code="400"></response>
        [AllowAnonymous]
        [HttpGet("{id}/activity")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<ActivityDTO>>> GetActivitiesOfRestaurant(int id, int startingIndex = 0, int endIndex = 20)
        {
            var restaurant = await context.Restaurants.FirstOrDefaultAsync(r => r.Id == id);
            if(restaurant is null) return BadRequest($"Restaurant with id {id} does not exist");

            var activities = new List<Tuple<ActivityDTO, DateTime>>();

            var posts = restaurant.Posts.
                                    OrderByDescending(p => p.Date).
                                    ToList();

            var resReviews = restaurant.Res_Review.
                                    Where(e => e.MarkedAsSpam == false).
                                    OrderByDescending(d => d.Id).
                                    ToList();
            var dishReviews = await context.DishReviews.
                                    Where(r => r.Dish.AppRestaurantId == restaurant.Id).
                                    Where(e => e.MarkedAsSpam == false).
                                    OrderByDescending(r => r.CreationDate).
                                    ToListAsync();

            foreach(var p in posts)
            {
                activities.Add(new Tuple<ActivityDTO, DateTime>(new ActivityDTO(p), p.Date));
            }
            
            foreach(var r in resReviews)
            {
                activities.Add(new Tuple<ActivityDTO, DateTime>(new ActivityDTO(r), r.CreationDate));
            }

            foreach(var r in dishReviews)
            {
                 activities.Add(new Tuple<ActivityDTO, DateTime>(new ActivityDTO(r), r.CreationDate));
            }

            var listToRet = new List<ActivityDTO>();
            foreach(var a in activities.
                            OrderByDescending(a => a.Item2).
                            Skip(startingIndex).
                            Take(endIndex).
                            ToList())
            {
                listToRet.Add(a.Item1);
            }

            return listToRet;
        }
        
    }
}