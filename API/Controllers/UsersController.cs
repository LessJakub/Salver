using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    [ApiController]
    public class UsersController : BaseApiController
    {
        private readonly DataContext _context;
        public UsersController(DataContext context)
        {
            _context = context;
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
        [Authorize(Policy = "AdminOnly")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
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
            var user = await _context.Users.FindAsync(id);

            if(user == null) return NoContent();

            return new UserProfileDto {
                Id = user.Id,
                Username = user.UserName,
                Verified = user.Verified,
                Followers = 0 //Should be implemented properly after follow table is implemented
            };
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
            var users = await _context.Users.Where(user => user.UserName.Contains(userName)).ToListAsync();

            var usersToReturn = new List<UserProfileDto>();
            foreach(var user in users)
            {
                usersToReturn.Add(new UserProfileDto(user));
            }
            return usersToReturn;
        }
    }
}