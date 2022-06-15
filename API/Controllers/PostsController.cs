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
    public class PostsController : BaseAuthController
    {
        public PostsController(DataContext context) : base(context)
        {
        }

        /// <summary>
        /// Creates new restaurant post
        /// </summary>
        /// <param name="restaurantId">Id of the restaurant</param>
        /// <param name="newPostDto">New post parameters</param>
        /// <remarks>Status codes not documented</remarks>
        /// <returns>PostDto from created post</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpPost("Restaurants/{restaurantId}/posts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PostDto>> CreateRestaurantPost(int restaurantId, NewPostDto newPostDto)
        {
            var ownCheck = await OwnsRestaurant(restaurantId);
            if(ownCheck.Item1 != StatusCodes.Status200OK) return StatusCode(ownCheck.Item1, ownCheck.Item2);

            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            
            
            var post = new Post{
                Date = DateTime.Now,
                Likes = 0,
                Description = newPostDto.Description,
                AppRestaurantId = restaurantId,
                AppRestaurant = restaurant
            };

            context.Add(post);
            await context.SaveChangesAsync();

            return new PostDto(post);
        }


        /// <summary>
        /// Creates new user post
        /// </summary>
        /// <param name="userId">Id of the user</param>
        /// <param name="newPostDto">Post parameters</param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns>PostDto from created post</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpPost("Users/{userId}/posts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PostDto>> CreateUserPost(int userId, NewPostDto newPostDto)
        {
            if(userId != GetRequesterId()) return Unauthorized("Only owner of account can create posts");

            var claimedId = GetRequesterId();
            var user = await context.Users.FindAsync(claimedId);
            
            if(user == null) return Unauthorized($"User with {claimedId} id does not exist");


            var post = new Post{
                Date = DateTime.Now,
                Likes = 0,
                Description = newPostDto.Description,
                AppUserId = userId,
                AppUser = user
            };

            context.Add(post);
            await context.SaveChangesAsync();

            return new PostDto(post);
        }

        /// <summary>
        /// Gets list of all posts created under certain restaurant
        /// </summary>
        /// <param name="restaurantId">Id of the restaurant</param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns>List of PostDtos created from restaurants posts</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [AllowAnonymous]
        [HttpGet("Restaurants/{restaurantId}/posts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<PostDto>>> ReadAllRestaurantPosts(int restaurantId)
        {
            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            if(restaurant == null) return BadRequest($"Restaurant with {restaurantId} id does not exist");

            var resPosts = new List<PostDto>();
            foreach(var post in restaurant.Posts.OrderByDescending(p => p.Date).ToList()) resPosts.Add(new PostDto(post));

            return resPosts;
        }

        /// <summary>
        /// Gets all posts of certain user
        /// </summary>
        /// <param name="userId">Id of the user</param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns>List of PostDtos created from users post</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpGet("Users/{userId}/posts")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<PostDto>>> ReadAllUserPosts(int userId)
        {
            var user = await context.Users.FindAsync(userId);
            if(user == null) return BadRequest($"User with {userId} id does not exist");

            var usrPosts = new List<PostDto>();
            foreach(var post in user.Posts.OrderByDescending(p => p.Date).ToList()) usrPosts.Add(new PostDto(post));

            return usrPosts;
        }

        /// <summary>
        /// Updates selected post of certain restaurant
        /// </summary>
        /// <param name="restaurantId">Id of the restaurant</param>
        /// <param name="newPostDto">Post parameters</param>
        /// <param name="postId">Id of the post</param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns>Returns PostDto from created post</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpPut("Restaurants/{restaurantId}/posts/{postId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PostDto>> UpdateRestauranstPost(int restaurantId, int postId, NewPostDto newPostDto)
        {
            var ownCheck = await OwnsRestaurant(restaurantId);
            if(ownCheck.Item1 != StatusCodes.Status200OK) return StatusCode(ownCheck.Item1,ownCheck.Item2);
            
            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            var post = restaurant.Posts.FirstOrDefault(p => p.Id == postId);
            if(post == null) return BadRequest($"Post with {postId} id does not exist");

            post.Description = newPostDto.Description;

            await context.SaveChangesAsync();

            return new PostDto(post);
        }

        /// <summary>
        /// Updates post of certain user
        /// </summary>
        /// <param name="userId">Id of the user</param>
        /// <param name="postId">Id of the post</param>
        /// <param name="newPostDto">Post parameters</param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns>PostDto from updated post</returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpPut("Users/{userId}/posts/{postId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PostDto>> UpdateUserPost(int userId, int postId, NewPostDto newPostDto)
        {
            var claimedId = GetRequesterId();
            if(userId != claimedId) return Unauthorized($"Claimed {claimedId} id is not the same as {userId}");

            var user = await context.Users.FindAsync(userId);

            var post = user.Posts.FirstOrDefault(p => p.Id == postId);
            if(post == null) return BadRequest($"Post with {postId} id does not exist");

            post.Description = newPostDto.Description;

            await context.SaveChangesAsync();

            return new PostDto(post);
        }

        /// <summary>
        /// Delates selected post
        /// </summary>
        /// <param name="restaurantId"></param>
        /// <param name="postId"></param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns></returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpDelete("Restaurants/{restaurantId}/posts/{postId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteRestaurantPost(int restaurantId, int postId)
        {
            var ownCheck = await OwnsRestaurant(restaurantId);
            if(ownCheck.Item1 != StatusCodes.Status200OK) return StatusCode(ownCheck.Item1, ownCheck.Item2);
            
            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            var post = restaurant.Posts.FirstOrDefault(p => p.Id == postId);
            if(post == null) return BadRequest($"Post with {postId} does not exist");

            context.Remove(post);

            await context.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// Deletes selected post
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="postId"></param>
        /// <remarks>Status codes not documnted</remarks>
        /// <returns></returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [Authorize]
        [HttpDelete("Users/{userId}/posts/{postId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> DeleteUserPost(int userId, int postId)
        {
            if(userId != GetRequesterId()) return Unauthorized();
            var user = await context.Users.FindAsync(userId);
            if(user == null) return BadRequest($"User with {userId} id does not exist");

            var post = user.Posts.FirstOrDefault(p => p.Id == postId);
            if(post == null) return BadRequest($"Post with {postId} id does not exist");
            context.Remove(post);
            await context.SaveChangesAsync();

            return Ok();
        }
    }
}