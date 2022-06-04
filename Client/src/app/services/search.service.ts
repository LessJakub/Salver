import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Dish } from '../models/Dish';
import { DishDTO } from '../models/DishDTO';
import { Restaurant } from '../models/restaurant';
import { SearchForm } from '../models/SearchForm';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private baseUrl: string = "http://" + location.hostname;
  private restaurantSearchUrl: string = this.baseUrl + ":8080/api/Restaurants/search"
  private restaurantDetailURL: string = this.baseUrl + ":8080/api/Restaurants/"

  private dishSearchByIDURL: string = this.baseUrl + ":8080/api/Dishes/Restaurants/"
  private dishSearchUrl: string = this.baseUrl + ":8080/api/Dishes/search"
  restaurants: Restaurant[] = []
  dishes: DishDTO[] = []
  constructor(private http: HttpClient) { }

    restaurantByID: Restaurant;

    async searchRestaurantByID(id: number) {
        this.restaurantByID =  await this.http.get<Restaurant>(this.restaurantDetailURL + id).toPromise();
    }

  async searchRestaurant(model: SearchForm) {

    if (model == null) {
        this.restaurants =  await this.http.get<Restaurant[]>(this.restaurantSearchUrl).toPromise();
    }
    if (model.input == null || model.input.length == 0) {
        this.restaurants =  await this.http.get<Restaurant[]>(this.restaurantSearchUrl).toPromise();
    }
    else {
        this.restaurants =  await this.http.get<Restaurant[]>(this.restaurantSearchUrl + "?restaurantName=" + model.input).toPromise();
    }
  }


  async searchDishes(model: SearchForm) {

    if (model == null) {
        this.dishes =  await this.http.get<DishDTO[]>(this.dishSearchUrl).toPromise();
    }
    else {
        if (model.input == null || model.input.length == 0) {
            this.dishes =  await this.http.get<DishDTO[]>(this.dishSearchUrl).toPromise();
        }
        else {
            this.dishes =  await this.http.get<DishDTO[]>(this.dishSearchUrl + "?dishName=" + model.input).toPromise();
        }
    }
  }

    async searchDishesByID(id: number) {

        return await this.http.get<DishDTO[]>(this.dishSearchByIDURL + id + "/dishes").toPromise();


    if (id == null) {
        return [];
        
    }
    else {
        return await this.http.get<DishDTO[]>(this.dishSearchByIDURL).toPromise();
    }
  }
}
