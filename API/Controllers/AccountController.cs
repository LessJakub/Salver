using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseAuthController
    {
         private readonly DataContext _context;
        private readonly ITokenService _tokenService;

        public AccountController(DataContext context, ITokenService tokenService) : base(context)
        {
            _tokenService = tokenService;
            _context = context;
        }


        /// <summary>
        /// Registers new user.
        /// </summary>
        /// <param name="registerDto">Registration information</param>
        /// <remarks></remarks>
        /// <returns>Authorization information of created user</returns>
        /// <response code="200"> Ok, new user is created. </response>
        /// <response code="400"> Bad request, invalid input. </response>
        [AllowAnonymous]
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is taken");

            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                UserName = registerDto.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
                Verified = false,
                Role = (Roles)registerDto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }


        /// <summary>
        /// Logins existing user
        /// </summary>
        /// <param name="loginDto"> Login information</param>
        /// <remarks></remarks>
        /// <returns>Authorization information of user</returns>
        /// <response code="200"> Ok,user is loged in </response>
        /// <response code="400"> Bard request, invalid input </response>
        /// <response code="401"> Unauthorized, wrong credentials </response>
        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == loginDto.Username);

            if (user == null) return Unauthorized("Invalid username");

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }

            //var restaurants = await GetRestaurantsOfUser(user);
            
            var restaurants = await GetRestaurantsIdsOfUser(user);
            var resId = (restaurants.Count() > 0)?(restaurants.First()):(0);

            return new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                Token = _tokenService.CreateToken(user, resId),
                IsRestaurantOwner = resId
            };
        }

        /// <summary>
        /// Changes username or passowrd of existing user
        /// </summary>
        /// <param name="id">Id of the user</param>
        /// <param name="updateDto">User information information</param>
        /// <remarks></remarks>
        /// <returns>UserDto with username and valid token</returns>
        /// <response code="200"> Ok, Username or password changed. </response>
        /// <response code="400"> Bad request, invalid input. </response>
        /// <response code="401"> Unauthorized, User has different id or is not admin. </response>
        [Authorize]
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserDto>> UpdateUser(int id, UserUpdateDto updateDto)
        {
            var idCode = AuthorizedById(id);
            var roleCode = AuthorizedByRole("Admin");
            if(roleCode == StatusCodes.Status200OK) {   }
            else if (idCode != StatusCodes.Status200OK) return StatusCode(idCode);

            var user = await _context.Users.FindAsync(id);

            if(updateDto.Username != null && updateDto.Username != user.UserName) 
            {
                if(!await UserExists(updateDto.Username)) user.UserName = updateDto.Username;
                else return BadRequest("Username is taken");
            }

            if(updateDto.Password != null)
            {
                using var hmac = new HMACSHA512();

                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(updateDto.Password));
                user.PasswordSalt = hmac.Key;
            }

            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        /// <summary>
        /// Deletes existing user.
        /// </summary>
        /// <param name="id">Id of the user</param>
        /// <remarks></remarks>
        /// <returns>Status code of action resault</returns>
        /// <response code="200"> Ok, user was deleted succesfully </response>
        /// <response code="400"> Bad request, invalid input. </response>
        /// <response code="401"> Unauthorized, User has different id or is not admin. </response>
        /// <response code="204"> User with specified id was not found. </response>
        [Authorize]
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var idCode = AuthorizedById(id);
            var roleCode = AuthorizedByRole("Admin");
            if(roleCode == StatusCodes.Status200OK) {}
            else if (idCode != StatusCodes.Status200OK) return StatusCode(idCode);

            var user = await _context.Users.FindAsync(id);

            if(user is null) return NoContent();
            
            foreach(var f in user.FollowedRestaurants.ToList())
            {
                f.Follower = null;
                f.FollowerId = 0;
                f.Followed = null;
                f.FollowedId = 0;
                _context.Remove(f);
            }

            foreach(var f in user.FollowedUsers.ToList())
            {
                f.Follower = null;
                f.FollowerId = 0;
                f.Followed = null;
                f.FollowedId = 0;
                _context.Remove(f);
            }

            foreach(var r in user.User_Res_Relation.ToList())
            {
                context.Remove(r.AppRestaurant);
                context.Remove(r);
            }

            _context.Remove(user);
            await _context.SaveChangesAsync();
            return Ok();
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }

        private async Task<List<RestaurantDto>> GetRestaurantsOfUser(AppUser appUser)
        {
            var relations = appUser.User_Res_Relation.ToList();
            List<RestaurantDto> restaurants = new List<RestaurantDto>();

            foreach(var relation in relations)
            {
                var restaurant = await _context.Restaurants.FirstOrDefaultAsync(res => res.Id == relation.AppRestaurantId);
                if(restaurant != null) restaurants.Add(new RestaurantDto(restaurant));
                //restaurants.Add(new RestaurantDto(await _context.Restaurants.FirstOrDefaultAsync(res => res.Id == relation.AppRestaurantId)));
            }

            return restaurants;
        }

        private async Task<List<int>> GetRestaurantsIdsOfUser(AppUser appUser)
        {
            if(appUser is null) return null;
            var relations = appUser.User_Res_Relation.ToList();


            List<int> restaurants = new List<int>();

            foreach(var relation in relations)
            {
                var restaurant = await _context.Restaurants.FirstOrDefaultAsync(res => res.Id == relation.AppRestaurantId);
                if(restaurant != null) restaurants.Add(restaurant.Id);
                //restaurants.Add(new RestaurantDto(await _context.Restaurants.FirstOrDefaultAsync(res => res.Id == relation.AppRestaurantId)));
            }

            return restaurants;
        }
    }
}