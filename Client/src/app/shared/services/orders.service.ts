import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DishDTO } from '../models/DishDTO';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {


  dishesInOrder : Array<DishDTO> = new Array<DishDTO>();
  currentRestaurant: number = 0;
  currentPrice: number = 0;

  private baseUrl: string = "http://" + location.hostname;
  private ordersUrl: string = this.baseUrl + ":8080/api/Orders/"

  private dishesUrl: string = this.baseUrl + ":8080/api/Dishes/"

  constructor(private http: HttpClient) { }

  

  public async order() : Promise<boolean>
  {

    return true;
  }

  public dishIdInOrder(id: number): number
  {
     return this.dishesInOrder.filter(d => d.id == id).length;
  }

  public addDishToOrder(dish: DishDTO, amount: number = 1): boolean
  {
    if(dish == null)
    {
      console.log("This dish is not proper.");
      return false;
    }
    if(amount < 1)
    {
      console.log("Provide proper amount.")
      return false;
    }

    var resId = 0;
    if(this.currentRestaurant == 0) this.currentRestaurant = dish.appRestaurantId
    if(this.currentRestaurant != dish.appRestaurantId)
    {
      console.log("Dish id and current restaurant id differs");
      return false;
    }
    resId = this.currentRestaurant
   
    for(var i = 0; i < amount; i++)
    {
      this.dishesInOrder.push(dish);
    }
    this.currentRestaurant = resId;
    this.calculateOrderPrice();
    return true;
  }

  public async addDishIdToOrder(dishId: number, amount: number = 1): Promise<boolean>
  {
    if(dishId < 1)
    {
      console.log("This dish id is not proper.")
      return false;
    }

    var dish = await this.http.get<DishDTO>(this.dishesUrl + dishId).toPromise()

    return this.addDishToOrder(dish, amount);
  }

  public removeDishFromOrder(dish: DishDTO): boolean
  {
    const index = this.dishesInOrder.indexOf(dish, 0)
    return this.removeDishIndex(index)
  }

  public removeDishWithIdFromOrder(id: number): boolean
  {
    const index = this.dishesInOrder.findIndex(dish => dish.id == id);
    return this.removeDishIndex(index)
  }

  private removeDishIndex(index: number) : boolean
  {
    if(index > -1)
    {
      this.dishesInOrder.splice(index, 1);
      return true;
    }
    else
    {
      console.log("Could not find this dish in the order");
    }
    return false;
  }


  public calculateOrderPrice(): number
  {
      var price: number = 0;
      this.dishesInOrder.forEach(dish => {
        price += dish.price;
        console.log(dish);
      });
      this.currentPrice = price;
      return price;
  }
}
