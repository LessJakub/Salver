using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ReviewsController : BaseAuthController
    {
        public ReviewsController(DataContext context) : base(context)
        {
        }


        /// <summary>
        /// Creates new restaurant review
        /// </summary>
        /// <param name="restaurantId">Id of the restaurant</param>
        /// <param name="newReviewDto">New review parameters</param>
        /// <remarks>If review already exist request will be routed to UpdateReview method.</remarks>
        /// <returns>ReviewDto from created post</returns>
        /// <response code="200">New review was created</response>
        [Authorize]
        [HttpPost("Restaurants/{restaurantId}/reviews")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<ReviewDto>> CreateRestaurantReview(int restaurantId, NewReviewDto newReviewDto)
        {
            var userId = GetRequesterId();
            var user = await context.Users.FindAsync(userId);
            if(user == null) return Unauthorized("User does not exist");

            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            if(restaurant == null) return BadRequest("Restaurant with given id does not exist");

            var rev = restaurant.Res_Review.FirstOrDefault(r => r.AppUserId == userId);
            if(rev != null) return await UpdateRestaurantReview(restaurantId, rev.Id, newReviewDto);
            
            var review = new Restaurant_Review{
                AtmosphereRating = newReviewDto.AtmosphereRating,
                ServiceRating = newReviewDto.ServiceRating,
                Description = newReviewDto.Description,
                AppRestaurantId = restaurantId,
                AppRestaurant = restaurant,
                AppUserId = userId,
                AppUser = user
            };
            

            context.Add(review);

            CalculateRestaurantScores(restaurant);

            await context.SaveChangesAsync();

            return new ReviewDto(review);
        }



        /// <summary>
        /// Gets list of all reviews created under certain restaurant
        /// </summary>
        /// <param name="restaurantId">Id of the restaurant</param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns>List of ReviewDto created from restaurants reviews</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [AllowAnonymous]
        [HttpGet("Restaurants/{restaurantId}/reviews")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<ReviewDto>>> ReadAllRestaurantReviews(int restaurantId)
        {
            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            if(restaurant == null) return BadRequest("Restaurant with given id does not exist");

            var resReviews = new List<ReviewDto>();
            foreach(var rev in restaurant.Res_Review.ToList()) resReviews.Add(new ReviewDto(rev));

            return resReviews;
        }

        /// <summary>
        /// Updates selected post of certain restaurant
        /// </summary>
        /// <param name="restaurantId">Id of the restaurant</param>
        /// <param name="newReviewDto">Post parameters</param>
        /// <param name="reviewId">Id of the post</param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns>Returns ReviewDto from created post</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpPut("Restaurants/{restaurantId}/reviews/{reviewId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ReviewDto>> UpdateRestaurantReview(int restaurantId, int reviewId, NewReviewDto newReviewDto)
        {
            //var ownCheck = await OwnsRestaurant(restaurantId);
            //if(ownCheck != StatusCodes.Status200OK) return StatusCode(ownCheck);
            //var restaurant = await context.Restaurants.FindAsync(restaurantId);
            //if(restaurant == null) return BadRequest("Restaurant with given id does not exist");

            var rev = context.RestaurantReviews.FirstOrDefault(r => r.Id == reviewId);
            if(rev == null) return await CreateRestaurantReview(restaurantId, newReviewDto);

            var userId = GetRequesterId();
            if(rev.AppUserId != userId) return Unauthorized("You don't have permissions to edit this post"); 

            //rev.Rating = newReviewDto.Rating;
            rev.Description = newReviewDto.Description;
            rev.AtmosphereRating = newReviewDto.AtmosphereRating;
            rev.ServiceRating = newReviewDto.ServiceRating;

            var restaurant = context.Restaurants.FirstOrDefault(r => r.Id == rev.AppRestaurantId);
            if(restaurant is null) return BadRequest($"Restaurant with id {rev.AppRestaurantId} does not exist.");
            CalculateRestaurantScores(restaurant);

            await context.SaveChangesAsync();

            return new ReviewDto(rev);
        }

        /// <summary>
        /// Delates selected post
        /// </summary>
        /// <param name="restaurantId"></param>
        /// <param name="reviewId"></param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns></returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpDelete("Restaurants/{restaurantId}/reviews/{reviewId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteRestaurantReview(int restaurantId, int reviewId)
        {
            //var ownCheck = await OwnsRestaurant(restaurantId);
            //if(ownCheck != StatusCodes.Status200OK) return StatusCode(ownCheck);
            
            //var restaurant = await context.Restaurants.FindAsync(restaurantId);
            //if(restaurant == null) return BadRequest("Restaurant with given id does not exist");
            var reqId = GetRequesterId();
            var adminCheck = AuthorizedByRole(Roles.Admin.ToString());

            var rev = context.RestaurantReviews.FirstOrDefault(r => r.Id == reviewId);
            if(rev == null) return BadRequest("Review with given id does not exist.");

            if(rev.AppUserId != reqId && adminCheck != StatusCodes.Status200OK) 
                return BadRequest($"User with id {reqId} is not creator of review {reviewId}.");

            context.Remove(rev);

            var restaurant = await context.Restaurants.FindAsync(rev.AppRestaurantId);
            if(restaurant == null) return BadRequest($"Restaurant with id {rev.AppRestaurantId} does not exist.");
            CalculateRestaurantScores(restaurant);

            await context.SaveChangesAsync();

            return Ok();
        }


        /// <summary>
        /// Creates new dish review
        /// </summary>
        /// <param name="dishId">Id of the dish</param>
        /// <param name="newReviewDto">New review parameters</param>
        /// <remarks>Status codes not documented</remarks>
        /// <returns>DishReviewDto from created dish review</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpPost("dishes/{dishId}/reviews")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<DishReviewDto>> CreateDishReview(int dishId,  NewDishReviewDto newReviewDto)
        {
            var userId = GetRequesterId();
            var user = await context.Users.FindAsync(userId);
            if(user == null) return Unauthorized("User does not exist");

            //var restaurant = await context.Restaurants.FindAsync(restaurantId);
            //if(restaurant == null) return BadRequest("Restaurant with given id does not exist");

            var dish = context.Dishes.FirstOrDefault(d => d.Id == dishId);
            if(dish == null) return BadRequest($"Dish with {dishId} id does not exist");

            var rev = dish.Dish_Review.FirstOrDefault(r => r.AppUserId == userId);
            if(rev != null) return await UpdateDishReview(dishId, rev.Id, newReviewDto);
            
            var review = new Dish_Review{
                TasteRating = newReviewDto.TasteRating,
                PriceRating = newReviewDto.PriceRating,
                ServiceRating = newReviewDto.ServiceRating,
                Description = newReviewDto.Description,
                Dish = dish,
                DishId = dishId,
                AppUserId = userId,
                AppUser = user
            };



            context.Add(review);

            CalculateDishScores(dish);

            await context.SaveChangesAsync();

            return new DishReviewDto(review);
        }



        /// <summary>
        /// Gets list of all reviews created under certain dish
        /// </summary>
        /// <param name="dishId">Id of the dish</param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns>List of DishReviewDto created from dish reviews</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [AllowAnonymous]
        [HttpGet("dishes/{dishId}/reviews")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<DishReviewDto>>> ReadAllDishReviews(int dishId)
        {
            var dish = context.Dishes.FirstOrDefault(d => d.Id == dishId);
            if(dish == null) return BadRequest($"Dish with {dishId} id does not exist");

            var dishReviews = new List<DishReviewDto>();
            foreach(var rev in dish.Dish_Review.ToList()) dishReviews.Add(new DishReviewDto(rev));

            return dishReviews;
        }

        /// <summary>
        /// Updates selected dish review
        /// </summary>
        /// <param name="dishId">Id of the review</param>
        /// <param name="reviewId">Id of the review</param>
        /// <param name="newReviewDto">Review parameters</param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns>Returns ReviewDto from created post</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpPut("dishes/{dishId}/reviews/{reviewId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<DishReviewDto>> UpdateDishReview(int dishId, int reviewId, NewDishReviewDto newReviewDto)
        {
            //var dish = context.Dishes.FirstOrDefault(d => d.Id == dishId);
            //if(dish == null) return BadRequest($"Dish with {dishId} id does not exist");

            var rev = context.DishReviews.FirstOrDefault(r => r.Id == reviewId);
            if(rev == null) return await CreateDishReview(dishId, newReviewDto);

            var userId = GetRequesterId();
            if(rev.AppUserId != userId) return Unauthorized("You don't have permissions to edit this post"); 

            rev.PriceRating = newReviewDto.PriceRating;
            rev.ServiceRating = newReviewDto.ServiceRating;
            rev.TasteRating = newReviewDto.TasteRating;
            rev.Description = newReviewDto.Description;


            var dish = await context.Dishes.FindAsync(rev.DishId);
            if(dish == null) return BadRequest($"Dish with id {rev.DishId} does not exist");
            CalculateDishScores(dish);

            await context.SaveChangesAsync();

            return new DishReviewDto(rev);
        }

        /// <summary>
        /// Delates selected dish review
        /// </summary>
        /// <param name="dishId">Id of review</param>
        /// <param name="reviewId">Id of review</param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns>Status code</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpDelete("dishes/{dishId}/reviews/{reviewId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteDishReview(int dishId, int reviewId)
        {
            //var ownCheck = await OwnsRestaurant(restaurantId);
            //if(ownCheck != StatusCodes.Status200OK) return StatusCode(ownCheck);
            
            //var restaurant = await context.Restaurants.FindAsync(restaurantId);
            //if(restaurant == null) return BadRequest("Restaurant with given id does not exist");

            //var dish = context.Dishes.FirstOrDefault(d => d.Id == dishId);
            //if(dish == null) return BadRequest($"Dish with {dishId} id does not exist");

            var rev = context.DishReviews.FirstOrDefault(r => r.Id == reviewId);
            if(rev == null) return BadRequest($"Dish review with {reviewId} id does not exist");

            var userId = GetRequesterId();
            var adminCheck = AuthorizedByRole(Roles.Admin.ToString());
            if(rev.AppUserId != userId && adminCheck != StatusCodes.Status200OK) return Unauthorized("You don't have permissions to edit this post"); 

            context.Remove(rev);
            var dish = await context.Dishes.FindAsync(dishId);
            if(dish is null) return BadRequest($"Dish with id {dishId} does not exist.");
            CalculateDishScores(dish);
            await context.SaveChangesAsync();

            return Ok();
        }


        private void CalculateRestaurantScores(AppRestaurant restaurant)
        {
            float serviceRating = 0.0f;
            float atmosphereRating = 0.0f;
            foreach(var r in restaurant.Res_Review.ToList())
            {
                serviceRating += r.AtmosphereRating;
                atmosphereRating += r.ServiceRating;
            }
            restaurant.ServiceRating = serviceRating/restaurant.Res_Review.Count();
            restaurant.AtmosphereRating = atmosphereRating/restaurant.Res_Review.Count();

        }

        private void CalculateDishScores(Dish dish)
        {

            float priceRating = 0.0f;
            float serviceRating = 0.0f;
            float tasteRating = 0.0f;
            foreach(var r in dish.Dish_Review.ToList())
            {
                priceRating += r.PriceRating;
                serviceRating += r.ServiceRating;
                tasteRating += r.TasteRating;
            }

            dish.PriceRating = priceRating/dish.Dish_Review.Count();
            dish.ServiceRating = serviceRating/dish.Dish_Review.Count();
            dish.TasteRating = tasteRating/dish.Dish_Review.Count();
        }
    }
}