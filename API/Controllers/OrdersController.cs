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
        [Authorize]
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
                ExpectedTime = TimeSpan.FromMinutes(15),
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
        /// <param name="userId">Id of the restaurant</param>
        /// <remarks></remarks>
        /// <returns>List of OrderDtos created from user orders</returns>
        /// <response code="200"> Returns list of orders with matching parameters</response>
        /// <response code="400"> Bad request, invalid input</response>
        [Authorize]
        [HttpGet("user/{userId}/orders")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<OrderDTO>>> ReadAllUserOrders(int userId, int startingIndex = 0, int endIndex = 12)
        {
            var user = await context.Users.FindAsync(userId);
            if(user == null) return BadRequest($"User with {userId} id does not exist");

            var usrOrders = new List<OrderDTO>();
            foreach(var order in context.Orders.
                Skip(startingIndex).
                Take(endIndex).
                OrderByDescending(o => o.SubmitTime).
                ToList()) usrOrders.Add(new OrderDTO(order));

            return usrOrders;
        }

        
        /// <summary>
        /// Gets list of all orders created in certain restaurant
        /// </summary>
        /// <param name="restaurantId">Id of the restaurant</param>
        /// <remarks></remarks>
        /// <returns>List of OrderDtos created from restaurant orders</returns>
        /// <response code="200"> Returns list of orders with matching parameters</response>
        /// <response code="400"> Bad request, invalid input</response>
        [Authorize]
        [HttpGet("Restaurants/{restaurantId}/orders")]
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
                ToList()) resOrders.Add(new OrderDTO(order));

            return resOrders;
        }
    }
}