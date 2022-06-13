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
    public class OrdersController : BaseAuthController
    {
        public OrdersController(DataContext context) : base(context)
        {
        }

        
        
        /// <summary>
        /// Creates a new order in certain restaurant
        /// </summary>
        /// <param name="newOrderDTO">Order paramaters</param>
        /// <remarks></remarks>
        /// <returns>OrderDTO from created order</returns>
        /// <response code="200"> Returns a new created order</response>
        /// <response code="400"> Bad request, invalid input</response>
        [Authorize("Customer")]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<OrderDTO>> Create(NewOrderDTO newOrderDTO)
        {
            
            var userId = GetRequesterId();
            var user = await context.Users.FindAsync(userId);
            if(user == null) return Unauthorized($"User with {userId} id does not exist");


            var restaurant = context.Restaurants.FirstOrDefault(r => r.Id == newOrderDTO.RestaurantId);
            if(restaurant is null) return BadRequest($"Restaurant with id {newOrderDTO.RestaurantId} does not exist");

            //hardcoded expected time, should be created as foreign key from the restaurand so they set it to some value

            var order = new Order{
                Address = newOrderDTO.Address,
                Status = Status.NEW,
                SubmitTime = DateTime.Now,
                ExpectedTime = TimeSpan.FromMinutes(60),
                AppUser = user,
                AppUserId = userId,
                AppRestaurant = restaurant,
                AppRestaurantId = newOrderDTO.RestaurantId,

            };

            var dishesInOrder = new List<DishInOrder>();
            float price = 0;
            foreach(var d in newOrderDTO.Dishes)
            {
                var tmp = context.Dishes.FirstOrDefault(x => x.Id == d);
                if(tmp is null) return BadRequest($"There is no dish with id {d}");

                if(tmp.AppRestaurantId != newOrderDTO.RestaurantId) 
                    return BadRequest($"Restaurant with id{newOrderDTO.RestaurantId} has no dish with id {d}");

                var dishInOrder = new DishInOrder {
                    Order = order,
                    OrderId = order.Id,
                    Dish = tmp,
                    DishId = tmp.Id
                };
                dishesInOrder.Add(dishInOrder);


                context.Add(dishInOrder);

                price += tmp.Price;
            }
            order.DishesInOrder = dishesInOrder;
            order.TotalPrice = price;

            context.Add(order);
            await context.SaveChangesAsync();

            return new OrderDTO(order);
        }


        /// <summary>
        /// Gets list of all orders created by a certain user
        /// </summary>
        /// <param name="startingIndex"></param>
        /// <param name="endIndex"></param>
        /// <remarks></remarks>
        /// <returns>List of OrderDtos created from user orders</returns>
        /// <response code="200"> Returns list of orders with matching parameters</response>
        /// <response code="400"> Bad request, invalid input</response>
        [Authorize("Customer")]
        [HttpGet("user")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<OrderDTO>>> ReadAllUserOrders( int startingIndex = 0, int endIndex = 12)
        {
            var userId = GetRequesterId();
            if(userId == -1) return BadRequest("You must be signed in to read you orders");

            var user = await context.Users.FindAsync(userId);
            if(user == null) return BadRequest($"User with {userId} id does not exist");

            var usrOrders = new List<OrderDTO>();
            foreach(var order in context.Orders.
                Skip(startingIndex).
                Take(endIndex).
                OrderByDescending(o => o.SubmitTime).
                OrderByDescending(o => o.Status).
                ToList()) 
                    usrOrders.Add(new OrderDTO(order));

            return usrOrders;
        }

        
        /// <summary>
        /// Gets list of all orders created in certain restaurant
        /// </summary>
        /// <param name="restaurantId">Id of the restaurant</param>
        /// <param name="startingIndex"></param>
        /// <param name="endIndex"></param>
        /// <remarks></remarks>
        /// <returns>List of OrderDtos created from restaurant orders</returns>
        /// <response code="200"> Returns list of orders with matching parameters</response>
        /// <response code="400"> Bad request, invalid input</response>
        [Authorize("RestaurantOwner")]
        [HttpGet("restaurant")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<OrderDTO>>> ReadAllRestaurantOrders(int restaurantId, int startingIndex = 0, int endIndex = 12)
        {
            var restaurant = await context.Restaurants.FindAsync(restaurantId);
            if(restaurant == null) return BadRequest($"Restaurant with {restaurantId} id does not exist");

            var resOrders = new List<OrderDTO>();
            foreach(var order in context.Orders.
                Skip(startingIndex).
                Take(endIndex).
                OrderByDescending(o => o.SubmitTime).
                OrderByDescending(o => o.Status).
                ToList()) 
                    resOrders.Add(new OrderDTO(order));

            return resOrders;
        }

        /// <summary>
        /// DEBUG FUNCTION
        /// </summary>
        /// <param name="orderId">Id of the restaurant</param>
        /// <param name="status"></param>
        /// <remarks></remarks>
        /// <returns>List of OrderDtos created from restaurant orders</returns>
        /// <response code="200"> Returns list of orders with matching parameters</response>
        /// <response code="400"> Bad request, invalid input</response>
        [Authorize("AdminOnly")]
        [HttpPut("orders/{orderId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> ChangeOrderStatus(int orderId, Status status)
        {
            var reqId = GetRequesterId();
            var user = await context.Users.FindAsync(reqId);
            if(user == null) return Unauthorized($"You must be signed in to do that");

            //If user is restaurant owner
            if(user.User_Res_Relation.Count() > 0)
            {
                foreach(var rel in user.User_Res_Relation.ToList())
                {
                    var restaurant = rel.AppRestaurant;
                    if(restaurant == null) return BadRequest($"Restaurant with id {rel.AppRestaurantId}");
                    var order = restaurant.Orders.FirstOrDefault(o => o.Id == orderId);
                    if(order == null) return BadRequest($"Order with id {orderId} does not belong to restaurant with id {restaurant.Id}.");

                    order.Status = status;
                }
            }
            else
            {
                if(status != Status.CANCELLED) return BadRequest($"User can only cancel orders");
                var order = user.Orders.FirstOrDefault(o => o.Id == orderId);
                if(order == null) return BadRequest($"User with id {reqId} does not own order with id {orderId}");

                if(order.Status != Status.NEW) return BadRequest($"User can cancel order only while it's {Status.NEW.ToString()}");

                order.Status = Status.CANCELLED;

            }

            return Ok();
        }

        /// <summary>
        /// Gets list of all orders created in certain restaurant
        /// </summary>
        /// <param name="orderId">Id of the restaurant</param>
        /// <param name="minutes"></param>
        /// <remarks></remarks>
        /// <returns>List of OrderDtos created from restaurant orders</returns>
        /// <response code="200"> Returns list of orders with matching parameters</response>
        /// <response code="400"> Bad request, invalid input</response>
        [Authorize("RestaurantOwner")]
        [HttpPut("restaurant/{orderId}/accept")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AcceptOrder(int orderId, int minutes = 60)
        {
            var reqId = GetRequesterId();
            var user = await context.Users.FindAsync(reqId);
            if(user == null) return Unauthorized($"You must be signed in to do that");

            foreach(var rel in user.User_Res_Relation.ToList())
            {
                var restaurant = rel.AppRestaurant;
                if(restaurant == null) return BadRequest($"Restaurant with id {rel.AppRestaurantId}");
                var order = restaurant.Orders.FirstOrDefault(o => o.Id == orderId);
                if(order == null) return BadRequest($"Order with id {orderId} does not belong to restaurant with id {restaurant.Id}.");

                order.Status = Status.IN_PROGRESS;
                order.ExpectedTime = TimeSpan.FromMinutes(minutes);

                break;
            }

            return Ok();
        }


        /// <summary>
        /// Gets list of all orders created in certain restaurant
        /// </summary>
        /// <param name="orderId">Id of the restaurant</param>
        /// <remarks></remarks>
        /// <returns>List of OrderDtos created from restaurant orders</returns>
        /// <response code="200"> Returns list of orders with matching parameters</response>
        /// <response code="400"> Bad request, invalid input</response>
        [Authorize]
        [HttpPut("{orderId}/cancel")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> CancelOrder(int orderId)
        {
            var reqId = GetRequesterId();
            var user = await context.Users.FindAsync(reqId);
            if(user == null) return Unauthorized($"You must be signed in to do that");

            //If user is restaurant owner
            if(user.User_Res_Relation.Count() > 0)
            {
                foreach(var rel in user.User_Res_Relation.ToList())
                {
                    var restaurant = rel.AppRestaurant;
                    if(restaurant == null) return BadRequest($"Restaurant with id {rel.AppRestaurantId}");
                    var order = restaurant.Orders.FirstOrDefault(o => o.Id == orderId);
                    if(order == null) return BadRequest($"Order with id {orderId} does not belong to restaurant with id {restaurant.Id}.");

                    order.Status = Status.CANCELLED;
                }
            }
            else
            {
                var order = user.Orders.FirstOrDefault(o => o.Id == orderId);
                if(order == null) return BadRequest($"User with id {reqId} does not own order with id {orderId}");

                if(order.Status != Status.NEW) return BadRequest($"User can cancel order only while it's {Status.NEW.ToString()}");

                order.Status = Status.CANCELLED;
            }

            return Ok();
        }

        /// <summary>
        /// Gets list of all orders created in certain restaurant
        /// </summary>
        /// <param name="orderId">Id of the restaurant</param>
        /// <remarks></remarks>
        /// <returns>List of OrderDtos created from restaurant orders</returns>
        /// <response code="200"> Returns list of orders with matching parameters</response>
        /// <response code="400"> Bad request, invalid input</response>
        [Authorize("RestaurantOwner")]
        [HttpPut("{orderId}/finish")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> FinishOrder(int orderId)
        {
            var reqId = GetRequesterId();
            var user = await context.Users.FindAsync(reqId);
            if(user == null) return Unauthorized($"You must be signed in to do that");
            if(user.User_Res_Relation.Count() < 1) return BadRequest($"User with id {reqId} does not own any restaurants");

            foreach(var rel in user.User_Res_Relation.ToList())
            {
                var restaurant = rel.AppRestaurant;
                if(restaurant == null) return BadRequest($"Restaurant with id {rel.AppRestaurantId}");
                var order = restaurant.Orders.FirstOrDefault(o => o.Id == orderId);
                if(order == null) return BadRequest($"Order with id {orderId} does not belong to restaurant with id {restaurant.Id}.");

                order.Status = Status.CANCELLED;
            }

            return Ok();
        }



    }
}