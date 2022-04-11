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
        public AccountController(DataContext context, ITokenService tokenService)
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

            return new UserDto
            {
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
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
                Username = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}