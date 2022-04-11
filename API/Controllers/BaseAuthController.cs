using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BaseAuthController : BaseApiController
    {

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
    }
}