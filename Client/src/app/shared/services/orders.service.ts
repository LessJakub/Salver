import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DishDTO } from '../models/DishDTO';
import { AccountService } from './account.service';
import { User } from '../models/UserDTO';
import { map } from 'rxjs/operators';
import { OrderDTO } from '../models/OrderDTO';

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

  constructor(private http: HttpClient, private accountService: AccountService) { }

  public address: string = "My address"


  public async order() : Promise<boolean>
  {
    var token;
    var authToken = this.accountService.currentUser$.subscribe((user: User) => {
            console.log(user);
            token = user.token;
    })

    var model: any = {}
    model.address = this.address;
    model.restaurantId = this.currentRestaurant;
    var dishes: Array<number> = new Array<number>();

    this.dishesInOrder.forEach(d => {
      console.log(d)
      dishes.push(d.id);
    })
    model.dishes = dishes;
    var head = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    var response = await this.http.post<OrderDTO>(this.ordersUrl , model, {headers: head}).pipe(
            map((Response:OrderDTO) =>{
              const order = Response;
              console.log(order);
            }, error => {
              console.log(error)
            }
          )).toPromise();

    this.dishesInOrder = new Array<DishDTO>();
    this.calculateOrderPrice();
    this.currentRestaurant = 0;
    return true;
  }

  public dishIdAmountInOrder(id: number): number
  {
    return this.dishesInOrder.filter(d => d.id == id).length;
  }

  public dishAmountInOrder(dish: DishDTO): number
  {
     return this.dishesInOrder.filter(d => d.id == dish.id).length;
  }

  public async setDishIdAmount(id : number, amount: number): Promise<boolean>
  {
    var dish = await this.getDish(id)
    return this.setDishAmount(dish, amount);
  }

  public setDishAmount(dish: DishDTO, amount: number): boolean
  {
    if(amount < 0)
    {
      console.log("Amount is not proper")
      return false;
    }
    var currentAmount = this.dishAmountInOrder(dish);
    if(currentAmount > amount) this.removeDishFromOrder(dish, currentAmount - amount);
    else if (currentAmount < amount) this.addDishToOrder(dish, amount - currentAmount);
    return true;
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

    var dish = await this.getDish(dishId);

    return this.addDishToOrder(dish, amount);
  }

  private async getDish(id: number) : Promise<DishDTO>
  {
    return await this.http.get<DishDTO>(this.dishesUrl + id).toPromise();
  }

  public removeDishFromOrder(dish: DishDTO, amount: number = 1): boolean
  {
    var currentAmount = this.dishAmountInOrder(dish);
    if(amount > currentAmount)
    {
      console.log("Cannot remove more than is in order.")
      return false;
    }
    
    for(var i = 0; i < amount; i++)
    {
      const index = this.dishesInOrder.indexOf(dish, 0)
      this.removeDishIndex(index)
    }
    
    return true;
  }

  public removeDishWithIdFromOrder(id: number, amount: number = 1): boolean
  {
    var currentAmount = this.dishIdAmountInOrder(id);
    if(amount > currentAmount)
    {
      console.log("Cannot remove more than is in order.")
      return false;
    }

    for(var i = 0; i < amount; i++)
    {
      const index = this.dishesInOrder.findIndex(dish => dish.id == id);
      this.removeDishIndex(index)
    }
    
    return true;
  }

  private removeDishIndex(index: number) : boolean
  {
    if(index > -1)
    {
      this.dishesInOrder.splice(index, 1);
      this.calculateOrderPrice();
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
        console.log(dish)
      });
      this.currentPrice = price;
      return price;
  }
}
