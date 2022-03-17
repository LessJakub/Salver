using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DSAClinic.Data;
using DSAClinic.Entities;
using Microsoft.AspNetCore.Mvc;

namespace DSAClinic.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext context;

        public AccountController(DataContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<AppUser>> GetUsers()
        {
            var users = this.context.Users.ToList();

            return users;
        }
    }
}