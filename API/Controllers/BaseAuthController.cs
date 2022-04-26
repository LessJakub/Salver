using System;
using System.Collections.Generic;
using System.Linq;
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

            var idClaim = principal.FindFirst("Id");

            if (idClaim == null || idClaim.Value != id.ToString()) return StatusCodes.Status401Unauthorized;

            return StatusCodes.Status200OK;
        }

        //Checks if request is made by someone who is an admin
        protected int AuthorizedByRole(string Role)
        {
            //Get claims present in the token
            var principal = HttpContext.User;
            if (principal?.Claims == null) return StatusCodes.Status400BadRequest;
            var roleClaim = principal.FindFirst("Role");

            if(roleClaim == null || roleClaim.Value != Role) return StatusCodes.Status401Unauthorized;
            return StatusCodes.Status200OK;
        }

        protected List<int> GetRestaurantsId()
        {
            var principal = HttpContext.User;
            if (principal?.Claims == null) return null;

            var idClaims = principal.FindAll(claim => claim.Type.Contains("RestaurantId"));
            if (idClaims == null) return null;

            var ids = new List<int>();

            foreach(var resId in idClaims) ids.Add(Int32.Parse(resId.Value));

            return ids;
        }

        protected async Task<int> OwnsRestaurant(int restaurantId)
        {
            var principal = HttpContext.User;
            if (principal?.Claims == null) return StatusCodes.Status400BadRequest;
            
            var resIdsClaims = GetRestaurantsId();
            
            if(resIdsClaims == null || !resIdsClaims.Contains(restaurantId)) return StatusCodes.Status401Unauthorized;

            var usrId = GetRequesterId();
            if(usrId < 0) return StatusCodes.Status400BadRequest;

            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            if(restaurant == null) return StatusCodes.Status400BadRequest;

            var usrResRel = restaurant.User_Res_Relation.Where(resOwn => resOwn.AppUserId == usrId);

            if(usrResRel == null) return StatusCodes.Status204NoContent;

            return StatusCodes.Status200OK;
        }
    }
}