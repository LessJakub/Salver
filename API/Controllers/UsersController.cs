using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    [ApiController]
    public class UsersController : BaseAuthController
    {
        public UsersController(DataContext context) : base(context)
        {
        }


        /// <summary>
        /// Gets all users
        /// </summary>
        /// <remarks></remarks>
        /// <returns>List of user entities</returns>
        /// <response code="200">Ok</response>
        /// <response code="204">No content (No users in DB)</response>
        /// <response code="400">Bard request, invalid input </response>
        /// <response code="401">Unauthorized, wrong credentials </response>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<IEnumerable<UserProfileDto>>> GetUsers()
        {
            var listToRet = new List<UserProfileDto>();
            foreach(var u in await context.Users.OrderByDescending(e => e.Id).ToListAsync())
            {
                listToRet.Add(new UserProfileDto(u));
            }
            return listToRet;
        }

        // Finding user by Id i.e. with api/users/3
        /// <summary>
        /// Gets public information of user with specified id
        /// </summary>
        /// <param name="id"> Id of the user</param>
        /// <remarks>Not completed, followers are always equal 0</remarks>
        /// <returns>UserProfileDto</returns>
        /// <response code="200">Ok</response>
        /// <response code="204">No content (User with id does not exist)</response>
        /// <response code="400">Bard request, invalid input </response>
        /// <response code="401">Unauthorized, wrong credentials </response>
        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserProfileDto>> GetUser(int id)
        {
            var user = await context.Users.FindAsync(id);

            if(user == null) return NoContent();

            return new UserProfileDto(user);
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
        /// <response code="401"></response>
        [HttpGet("follows-restaurant")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Boolean>> UserFollowsRestaurant([FromQuery] int id)
        {
            var userId = GetRequesterId();
            var user = await context.Users.FindAsync(userId);
            if(user is null) return false;

            var restaurant = user.FollowedRestaurants.FirstOrDefault(f => f.FollowedId == id);
            if(restaurant is null) return false;
            return true;
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
        /// <response code="401"></response>
        [HttpGet("follows-user")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<Boolean>> UserFollowsUser([FromQuery] int id)
        {
            var userId = GetRequesterId();
            var user = await context.Users.FindAsync(userId);
            if(user == null) return BadRequest($"There is no user with id {userId}");

            var followed = user.FollowedUsers.FirstOrDefault(f => f.FollowedId == id);
            if(followed is null) return false;
            return true;
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
        /// <response code="401"></response>
        [HttpPost("{id}/follow")]
        [Authorize(Roles = "Customer")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> FollowUser(int id)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if(user == null) return NoContent();

            var reqId = GetRequesterId();
            if(id == -1) return BadRequest($"You must be signed in to follow someone");

            var requester = await context.Users.FirstOrDefaultAsync(r => r.Id == reqId);
            if(requester is null) return BadRequest($"Your account, with id {reqId}, does not exist");

            var prevFollow = requester.FollowedUsers.FirstOrDefault(f => f.FollowedId == id);
            if(prevFollow is not null) return BadRequest($"You already follow user with id {id}");

            var follow = new UserFollower {
              FollowerId = reqId,
              Follower = requester,
              FollowedId = id,
              Followed = user
            };

            context.Add(follow);
            await context.SaveChangesAsync();

            return Ok();
        }

        #if DEBUG

        #endif

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200"></response>
        /// <response code="204"></response>
        /// <response code="400"></response>
        /// <response code="401"></response>
        [HttpGet("{id}/followed-users")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<List<FollowerDTO>>> GetFollowedByUser(int id)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if(user == null) return NoContent();

            var listToRet = new List<FollowerDTO>();
            foreach(var f in user.FollowedUsers.ToList())
            {
                listToRet.Add(new FollowerDTO(f));
            }

            return listToRet;
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
        /// <response code="401"></response>
        [HttpGet("{id}/followers")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<List<FollowerDTO>>> GetFollowersOfUser(int id)
        {
            var listToRet = new List<FollowerDTO>();
            foreach(var f in await context.Follows.Where(x => x.FollowedId == id).ToListAsync())
            {
                var tmp = new FollowerDTO{
                    Id = f.FollowerId,
                    Name = f.Follower.UserName
                };
                listToRet.Add(tmp);
            }

            return listToRet;
        }

        // 
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"> </param>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200"></response>
        /// <response code="204"></response>
        /// <response code="400"></response>
        /// <response code="401"></response>
        [HttpDelete("{id}/unfollow")]
        [Authorize(Roles = "Customer")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> UnfollowUser(int id)
        {

            var reqId = GetRequesterId();
            if(id == -1) return BadRequest($"You must be signed in to unfollow someone");

            var user = await context.Users.FindAsync(reqId);
            if(user == null) return NoContent();

            var follow = user.FollowedUsers.FirstOrDefault(f => f.FollowedId == id);
            if(follow == null) return BadRequest($"You are not following user with id {id}");

            context.Remove(follow);
            await context.SaveChangesAsync();
            
            return Ok();
        }

        /// <summary>
        /// Search user with specific name
        /// </summary>
        /// <param name="userName">String containing search information</param>
        /// <remarks>
        /// Must be logged in as any user to use this endpoint.
        /// Finds all users containing search information. Not case sensitive. 
        /// Always returns status code 200 OK but may return empty list. 
        /// Currentlly accpets only name as parameter</remarks>
        /// <returns>list of UserProfileDto</returns>
        /// <response code="200"> Returns list of users with matching parameters</response>
        [Authorize]
        [HttpGet("search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IEnumerable<UserProfileDto>> SearchUser(string userName)
        {
            var users = await context.Users.Where(user => user.UserName.Contains(userName)).ToListAsync();

            var usersToReturn = new List<UserProfileDto>();
            foreach(var user in users)
            {
                usersToReturn.Add(new UserProfileDto(user));
            }
            return usersToReturn;
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
        [Authorize]
        [HttpGet("activity")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<ActivityDTO>>> GetActivitiesOfUser(int startingIndex = 0, int endIndex = 20)
        {
            var userId = GetRequesterId();
            if(userId == -1) return BadRequest("You be signed in to get you activities");

            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if(user is null) return BadRequest($"User with id {userId} does not exist");

            var activities = new List<Tuple<ActivityDTO, DateTime>>();

            foreach(var post in context.Posts.
                                Where(p => user.FollowedRestaurants.Select(f => f.FollowedId).Contains((int)p.AppRestaurantId)).
                                OrderByDescending(p => p.Date).
                                ToList())
            {
                activities.Add(new Tuple<ActivityDTO, DateTime>(new ActivityDTO(post), post.Date));
            }

            foreach(var post in context.Posts.
                                Where(p => user.FollowedUsers.Select(f => f.FollowedId).Contains((int)p.AppUserId)).
                                OrderByDescending(p => p.Date).
                                ToList())
            {
                activities.Add(new Tuple<ActivityDTO, DateTime>(new ActivityDTO(post), post.Date));
            }

            foreach(var followed in await context.Users.Where(u => user.FollowedUsers.Select(f => f.Id).Contains(u.Id)).ToListAsync())
            {
                foreach(var dish_review in followed.Dish_Review.OrderByDescending(dr => dr.CreationDate).ToList())
                {
                    activities.Add(new Tuple<ActivityDTO, DateTime>(new ActivityDTO(dish_review), dish_review.CreationDate));
                }

                foreach(var rest_review in followed.Res_Review.OrderByDescending(rr => rr.CreationDate).ToList())
                {
                    activities.Add(new Tuple<ActivityDTO, DateTime>(new ActivityDTO(rest_review), rest_review.CreationDate));
                }

                foreach(var post in followed.Posts.OrderByDescending(p => p.Date).ToList())
                {
                    activities.Add(new Tuple<ActivityDTO, DateTime>(new ActivityDTO{
                                                                        Id = post.Id,
                                                                        Type = ActivityType.USER_POST,
                                                                        Date = post.Date,
                                                                        Description = post.Description,
                                                                        Likes = post.Likes,
                                                                        CreatorId = (int)post.AppUserId },
                                                                        post.Date));
                }
            }

             

            var listToRet = new List<ActivityDTO>();

            foreach(var activity in activities.
                                    OrderByDescending(a => a.Item2).
                                    Skip(startingIndex).
                                    Take(endIndex).
                                    ToList())
            {
                listToRet.Add(activity.Item1);
            }            

            

            return listToRet;
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
        /// <response code="401"></response>
        [HttpGet("{id}/activity")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<List<ActivityDTO>>> GetActivityOfUserWithId(int id, int startingIndex = 0, int endIndex = 12)
        {
            var user = await context.Users.FindAsync(id);
            if(user is null) return NoContent();

            var listToRet = new List<ActivityDTO>();

            foreach(var p in user.Posts.OrderByDescending(e => e.Date).
                                        ToList())
            {
                listToRet.Add(new ActivityDTO{
                    Id = p.Id,
                    Type = ActivityType.USER_POST,
                    Date = p.Date,
                    Description = p.Description,
                    Likes = p.Likes,
                    CreatorId = (int)p.AppUserId
                });
            }

            foreach(var dr in user.Dish_Review.OrderByDescending(e => e.CreationDate).
                                            ToList())
            {
                listToRet.Add(new ActivityDTO(dr));
            }
            
            foreach(var rr in user.Res_Review.OrderByDescending(e => e.CreationDate).
                                            ToList())
            {
                listToRet.Add(new ActivityDTO(rr));
            }

            return listToRet.OrderByDescending(a => a.Date).
                            Skip(startingIndex).
                            Take(endIndex).
                            ToList();
        }
    }
}