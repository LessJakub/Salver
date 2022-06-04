using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;

namespace API.Controllers
{
    public class OrdersController : BaseAuthController
    {
        public OrdersController(DataContext context) : base(context)
        {
        }
    }
}