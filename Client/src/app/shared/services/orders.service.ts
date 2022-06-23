import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DishDTO } from '../models/DishDTO';
import { AccountService } from './account.service';
import { User } from '../models/UserDTO';
import { map } from 'rxjs/operators';
import { OrderDTO } from '../models/OrderDTO';
import { dishesInOrderDTO } from '../models/DishesInOrderDTO';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {


  dishesInOrder : Array<DishDTO> = new Array<DishDTO>();
  Cart: Array<[DishDTO, number]> = new Array<[DishDTO, number]>();
  currentRestaurant: number = 0;
  currentPrice: number = 0;

  dishesInCartLengthSource = new ReplaySubject<number>();
  dishesInCartLength = this.dishesInCartLengthSource.asObservable();

  private baseUrl: string = "http://" + location.hostname;
  private ordersUrl: string = this.baseUrl + ":8080/api/Orders/"
  private dishesUrl: string = this.baseUrl + ":8080/api/Dishes/"

  constructor(private http: HttpClient, private accountService: AccountService) 
  { 
      accountService.currentUser$.subscribe(User => {
        if(User == null)
        {
          console.log("User is null")
          this.resetCart();
        }
      })

  }

  private resetCart()
  {
    this.dishesInOrder = new Array<DishDTO>();
    this.Cart = new Array<[DishDTO, number]>();
    this.calculateOrderPrice();
    this.currentRestaurant = 0;
  }

  public address: string = "My address"

  private onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  public async UpdateCart()
  {
    var uniqueDishes = this.dishesInOrder.filter(this.onlyUnique);

    var dishesIds = {} as dishesInOrderDTO
    dishesIds.dishesIds = new Array<number>();

    if(uniqueDishes.length == 0)
    {
      this.resetCart()
      return;
    }

    uniqueDishes.forEach(d => {
      dishesIds.dishesIds.push(d.id)
    })

    await this.http.post<DishDTO[]>(this.baseUrl + ':8080/dishes', dishesIds).toPromise().then((Response: DishDTO[]) => {
        this.Cart = new Array<[DishDTO, number]>();
        Response.forEach((dish:DishDTO) => {
            this.Cart.push([dish, this.dishAmountInOrder(dish)])
        });
    });
  }


  public async order() : Promise<boolean>
  {
    var token;
    this.accountService.currentUser$.subscribe((user: User) => {
      if(user != null)
      {
          token = user.token;
      }})

    var model: any = {}
    model.address = this.address;
    model.restaurantId = this.currentRestaurant;
    var dishes: Array<number> = new Array<number>();

    this.dishesInOrder.forEach(d => {
      dishes.push(d.id);
    })
    model.dishes = dishes;
    var head = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    await this.http.post<OrderDTO>(this.ordersUrl , model, {headers: head}).pipe(
            map((Response:OrderDTO) =>{
              const order = Response;
            }, (error : HttpErrorResponse) => {
              console.error(error)
              alert(error.message)
            }
          )).toPromise();

    this.resetCart();
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
    if(currentAmount > amount)
    {
      return this.removeDishFromOrder(dish, currentAmount - amount);
    } 
    else if (currentAmount < amount)
    {
      return this.addDishToOrder(dish, amount - currentAmount);
    } 
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
      console.log("Dish id and current restaurant id differs.");
      alert("Sorry but this dish is from another restaurant than rest of the order.")
      return false;
    }
    resId = this.currentRestaurant
   
    for(var i = 0; i < amount; i++)
    {
      this.dishesInOrder.push(dish);
    }
    this.currentRestaurant = resId;
    this.calculateOrderPrice();
    this.dishesInCartLengthSource.next(this.dishesInOrder.length)
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
    console.log(dish)
    var currentAmount = this.dishAmountInOrder(dish);
    if(amount > currentAmount)
    {
      console.log("Cannot remove more than is in order.")
      return false;
    }
    
    for(var i = 0; i < amount; i++)
    {
      const index = this.dishesInOrder.findIndex(d => d.id == dish.id)
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
      this.dishesInCartLengthSource.next(this.dishesInOrder.length)
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

      });
      this.currentPrice = price;
      
      this.UpdateCart();
      return price;
  }
}
