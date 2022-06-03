import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Restaurant } from '../models/restaurant';
import { SearchForm } from '../models/SearchForm';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  baseUrl: string = "http://" + location.hostname;
  searchUrl: string = this.baseUrl + ":8080/api/Restaurants/search"
  restaurants: Restaurant[] = []
  constructor(private http: HttpClient) { }

  async searchRestaurant(model: SearchForm)
  {

    if (model.input == null || model.input.length == 0) {
        this.restaurants =  await this.http.get<Restaurant[]>(this.searchUrl).toPromise();
    }
    else {
        this.restaurants =  await this.http.get<Restaurant[]>(this.searchUrl + "?restaurantName=" + model.input).toPromise();
    }
    
  }
}
