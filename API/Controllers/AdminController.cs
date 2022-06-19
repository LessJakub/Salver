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
    public class SpamController : BaseAuthController
    {
        public SpamController(DataContext context) : base(context)
        {
        }

        /// <summary>
        /// 
        /// </summary>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200">Ok</response>
        /// <response code="204">No content (No users in DB)</response>
        /// <response code="400">Bard request, invalid input </response>
        /// <response code="401">Unauthorized, wrong credentials </response>
        [HttpPost("spam/dish-reviews")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> MarkDishReviewAsSpam(int id)
        {
            var dishReview = await context.DishReviews.FindAsync(id);
            if(dishReview is null) return NoContent();

            dishReview.SpamMarkedDate = DateTime.Now;

            return await AddRequesterToSpamList(dishReview.MarkedAsSpam);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200">Ok</response>
        /// <response code="204">No content (No users in DB)</response>
        /// <response code="400">Bard request, invalid input </response>
        /// <response code="401">Unauthorized, wrong credentials </response>
        [HttpPost("spam/restaurant-reviews")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> MarkRestauranReviewAsSpam(int id)
        {
            var restReview = await context.RestaurantReviews.FindAsync(id);
            if(restReview is null) return NoContent();

            restReview.SpamMarkedDate = DateTime.Now;

            return await AddRequesterToSpamList(restReview.MarkedAsSpam);
        }

        private async Task<ActionResult> AddRequesterToSpamList(bool spamMark)
        {

            if(spamMark == true) return BadRequest($"Review already marked as spam");

            spamMark = true;

            await context.SaveChangesAsync();

            return Ok();
        }


        /// <summary>
        /// 
        /// </summary>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200">Ok</response>
        /// <response code="204">No content (No users in DB)</response>
        /// <response code="400">Bard request, invalid input </response>
        /// <response code="401">Unauthorized, wrong credentials </response>
        [HttpGet("spam")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult<List<ActivityDTO>> GetMarkedAsSpam()
        {
            var markedDishReviews = context.DishReviews.Where(dr => dr.MarkedAsSpam == true).OrderBy(e => e.SpamMarkedDate).ToList();
            var markedRestaurantReviews = context.RestaurantReviews.Where(rr => rr.MarkedAsSpam == true).OrderBy(e => e.SpamMarkedDate).ToList();

            var listToRet = new List<ActivityDTO>();

            foreach(var dr in markedDishReviews)
            {
                listToRet.Add(new ActivityDTO(dr));
            }

            foreach(var rr in markedRestaurantReviews)
            {
                listToRet.Add(new ActivityDTO(rr));
            }

            return listToRet;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200">Ok</response>
        /// <response code="204">No content (No users in DB)</response>
        /// <response code="400">Bard request, invalid input </response>
        /// <response code="401">Unauthorized, wrong credentials </response>
        [HttpDelete("spam/dish-reviews/{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> DeleteDishReview(int id)
        {
            var dishReview = await context.DishReviews.FindAsync(id);
            if(dishReview is null) return NoContent();

            if(dishReview.MarkedAsSpam == false) 
                return BadRequest($"Dish review with id {id} is not marked as spam");

            context.Remove(dishReview);

            await context.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200">Ok</response>
        /// <response code="204">No content (No users in DB)</response>
        /// <response code="400">Bard request, invalid input </response>
        /// <response code="401">Unauthorized, wrong credentials </response>
        [HttpDelete("spam/restaurant-reviews/{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> DeleteRestaurantReview(int id)
        {
            var restReview = await context.RestaurantReviews.FindAsync(id);
            if(restReview is null) return NoContent();

            if(restReview.MarkedAsSpam == false) 
                return BadRequest($"Dish review with id {id} is not marked as spam");

            context.Remove(restReview);

            await context.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200">Ok</response>
        /// <response code="204">No content (No users in DB)</response>
        /// <response code="400">Bard request, invalid input </response>
        /// <response code="401">Unauthorized, wrong credentials </response>
        [HttpPut("spam/dish-reviews/{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> ClearDishReview(int id)
        {
            var dishReview = await context.DishReviews.FindAsync(id);
            if(dishReview is null) return NoContent();

            if(dishReview.MarkedAsSpam == false) 
                return BadRequest($"Dish review with id {id} is not marked as spam");

            dishReview.MarkedAsSpam = false;
            dishReview.SpamMarkedDate = null;

            await context.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200">Ok</response>
        /// <response code="204">No content (No users in DB)</response>
        /// <response code="400">Bard request, invalid input </response>
        /// <response code="401">Unauthorized, wrong credentials </response>
        [HttpPut("spam/restaurant-reviews/{id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> ClearRestaurantReview(int id)
        {
            var restReview = await context.RestaurantReviews.FindAsync(id);
            if(restReview is null) return NoContent();

            if(restReview.MarkedAsSpam == false) 
                return BadRequest($"Dish review with id {id} is not marked as spam");

            restReview.MarkedAsSpam = false;
            restReview.SpamMarkedDate = null;

            await context.SaveChangesAsync();

            return Ok();
        }
    }
}