import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Restaurant } from '../models/restaurant';

@Injectable({
  providedIn: 'root'
})
export class SearchService {


  baseUrl: string = "http://" + location.hostname;
  searchUrl: string = this.baseUrl + ":8080/api/Restaurants/search"
  restaurants: Restaurant[] = []
  constructor(private http: HttpClient) { }

  searchRestaurant(model: any)
  {
    this.http.get<Restaurant[]>(this.searchUrl + "?restaurantName=" + model.restaurantName).subscribe(
      (restaurants: Restaurant[]) =>
      {
        this.restaurants = restaurants
      }
    )
  }
}
