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
        /// 
        /// </summary>
        /// <param name="newOrderDTO"></param>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
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

            var order = new Order{
                Address = newOrderDTO.Address,
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
        /// 
        /// </summary>
        /// <param name="restaurantId"></param>
        /// <remarks></remarks>
        /// <returns></returns>
        /// <response code="200">  </response>
        /// <response code="400">  </response>
        [AllowAnonymous]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<OrderDTO>>> ReadAll(int restaurantId)
        {
            var orders = new List<OrderDTO>();
            foreach(var order in context.Orders.ToList()) orders.Add(new OrderDTO(order));

            return orders;
        }
    }
}