import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Dish } from '../models/Dish';
import { Restaurant } from '../models/restaurant';
import { SearchForm } from '../models/SearchForm';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  baseUrl: string = "http://" + location.hostname;
  restaurantSearchUrl: string = this.baseUrl + ":8080/api/Restaurants/search"
  dishSearchUrl: string = this.baseUrl + ":8080/api/Dishes/search"
  restaurants: Restaurant[] = []
  dishes: Dish
  constructor(private http: HttpClient) { }


  async searchRestaurant(model: SearchForm)
  {

    if (model.input == null || model.input.length == 0) {
        this.restaurants =  await this.http.get<Restaurant[]>(this.restaurantSearchUrl).toPromise();
    }
    else {
        this.restaurants =  await this.http.get<Restaurant[]>(this.restaurantSearchUrl + "?restaurantName=" + model.input).toPromise();
    }
    
  }


  async searchMeals(model: SearchForm)
  {

    if (model.input == null || model.input.length == 0) {
        this.restaurants =  await this.http.get<Restaurant[]>(this.dishSearchUrl).toPromise();
    }
    else {
        this.restaurants =  await this.http.get<Restaurant[]>(this.dishSearchUrl + "?restaurantName=" + model.input).toPromise();
    }
    
  }
}
