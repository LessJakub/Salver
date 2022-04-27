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
        /// <remarks>Status codes not documented</remarks>
        /// <returns>ReviewDto from created post</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpPost("Restaurants/{restaurantId}/reviews")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ReviewDto>> Create(int restaurantId, NewReviewDto newReviewDto)
        {
            var userId = GetRequesterId();
            var user = await context.Users.FindAsync(userId);
            if(user == null) return Unauthorized("User does not exist");

            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            if(restaurant == null) return BadRequest("Restaurant with given id does not exist");

            var rev = restaurant.Res_Review.FirstOrDefault(r => r.AppUserId == userId);
            if(rev != null) return BadRequest("You've already reviewed this restaurant");
            
            var review = new Restaurant_Review{
                Rating = newReviewDto.Rating,
                Description = newReviewDto.Description,
                AppRestaurantId = restaurantId,
                AppRestaurant = restaurant,
                AppUserId = userId,
                AppUser = user
            };

            context.Add(review);
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
        public async Task<ActionResult<List<ReviewDto>>> ReadAll(int restaurantId)
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
        public async Task<ActionResult<ReviewDto>> Update(int restaurantId, int reviewId, NewReviewDto newReviewDto)
        {
            //var ownCheck = await OwnsRestaurant(restaurantId);
            //if(ownCheck != StatusCodes.Status200OK) return StatusCode(ownCheck);
            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            if(restaurant == null) return BadRequest("Restaurant with given id does not exist");

            var rev = restaurant.Res_Review.FirstOrDefault(r => r.Id == reviewId);
            if(rev == null) return BadRequest("Review with given Id does not exist");

            var userId = GetRequesterId();
            if(rev.AppUserId != userId) return Unauthorized("You don't have permissions to edit this post"); 

            rev.Rating = newReviewDto.Rating;
            rev.Description = newReviewDto.Description;

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
        public async Task<ActionResult> Delete(int restaurantId, int reviewId)
        {
            //var ownCheck = await OwnsRestaurant(restaurantId);
            //if(ownCheck != StatusCodes.Status200OK) return StatusCode(ownCheck);
            
            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            if(restaurant == null) return BadRequest("Restaurant with given id does not exist");

            var rev = restaurant.Res_Review.FirstOrDefault(r => r.Id == reviewId);
            if(rev == null) return BadRequest("Review with given id does not exist");

            context.Remove(rev);

            await context.SaveChangesAsync();

            return Ok();
        }

    }
}