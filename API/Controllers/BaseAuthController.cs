using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BaseAuthController : BaseApiController
    {
        protected readonly DataContext context;

        public BaseAuthController(DataContext context)
        {
            this.context = context;
        }

        protected int GetRequesterId()
        {
            var principal = HttpContext.User;
            if (principal?.Claims == null) return -1;

            var idClaim = principal.FindFirst("UserId");
            if (idClaim == null) return -1;

            return Int32.Parse(idClaim.Value);
        }

        //Checks if request is made by someone with id
        protected int AuthorizedById(int id)
        {
            //Get claims present in the token
            var principal = HttpContext.User;
            if (principal?.Claims == null) return StatusCodes.Status400BadRequest;

            var idClaim = principal.FindFirst("UserId");

            if (idClaim == null || idClaim.Value != id.ToString()) return StatusCodes.Status401Unauthorized;

            return StatusCodes.Status200OK;
        }

        //Checks if request is made by someone who is an admin
        protected int AuthorizedByRole(string Role)
        {
            //Get claims present in the token
            var principal = HttpContext.User;
            if (principal?.Claims == null) return StatusCodes.Status400BadRequest;
            var roleClaim = principal.FindFirst(ClaimTypes.Role);

            if(roleClaim == null || roleClaim.Value != Role) return StatusCodes.Status401Unauthorized;
            return StatusCodes.Status200OK;
        }

        protected int GetRestaurantsId()
        {
            var principal = HttpContext.User;
            if (principal?.Claims == null) return 0;

            var idClaims = principal.FindFirst(claim => claim.Type.Contains("Restaurant"));
            if (idClaims == null) return 0;

            return Int32.Parse(idClaims.Value);
        }

        protected async Task<(int, string)> OwnsRestaurant(int restaurantId)
        {
            var principal = HttpContext.User;
            if (principal?.Claims == null) 
                return (StatusCodes.Status400BadRequest, "User does not have any claims");
            
            var resIdsClaims = GetRestaurantsId();
            Console.WriteLine(resIdsClaims);
            if(resIdsClaims != restaurantId)
                return (StatusCodes.Status401Unauthorized, $"User token does not claim to own restaurant with {restaurantId} id");

            var usrId = GetRequesterId();
            if(usrId < 0) 
                return (StatusCodes.Status400BadRequest, $"Usert with {usrId} id does not exist");

            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            if(restaurant == null) 
                return (StatusCodes.Status400BadRequest, $"Restaurant with {restaurantId} does not exist");

            var usrResRel = restaurant.User_Res_Relation.Where(resOwn => resOwn.AppUserId == usrId);

            if(usrResRel == null) 
                return (StatusCodes.Status204NoContent, $"User with {usrId} does not have relation with restaurant with {restaurantId} id");

            return (StatusCodes.Status200OK, "OK");
        }
    }
}