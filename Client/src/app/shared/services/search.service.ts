import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchForm } from 'src/app/models/SearchForm';
import { DishDTO } from '../models/DishDTO';
import { RestaurantDTO } from '../models/RestaurantDTO';


@Injectable({
    providedIn: 'root'
})
export class SearchService {

    private baseUrl: string = "http://" + location.hostname;
    private restaurantSearchUrl: string = this.baseUrl + ":8080/api/Restaurants/search"
    private restaurantDetailURL: string = this.baseUrl + ":8080/api/Restaurants/"

    private dishSearchByIDURL: string = this.baseUrl + ":8080/api/Dishes/Restaurants/"
    private dishSearchUrl: string = this.baseUrl + ":8080/api/Dishes/search"
    restaurants: RestaurantDTO[] = []
    dishes: DishDTO[] = []
    constructor(private http: HttpClient) { }


    /**
     * Returns RestaurantDTO object identified by given ID.
     * @param id Restaurant ID
     * @returns RestaurantDTO object, null if not found.
     */
    async searchRestaurantByID(id: number) {
        if (id == null || id == NaN) {
            return null;
        }
        return await this.http.get<RestaurantDTO>(this.restaurantDetailURL + id).toPromise();
    }

    /**
     * Returns name of restaurant for given ID.
     * @param id Restaurant ID
     * @returns Name of restaurant (string)
     */
    async getRestaurantNameByID(id: number) {
        var restaurant: RestaurantDTO;
        this.http.get<RestaurantDTO>(this.restaurantDetailURL + id).toPromise().then((restModel) => {
            restaurant = restModel;
        });

        return restaurant.name;
    }

    /**
     * Performs searching for restaurants which match form input string in name.
     * If input string is empty, all restaurants are returned.
     * After fetching, data is available under `restaurant` property.
     * @param model Form model with input string
     */
    async searchRestaurant(model: SearchForm) {

        if (model == null) {
            this.restaurants = await this.http.get<RestaurantDTO[]>(this.restaurantSearchUrl).toPromise();
        }
        if (model.input == null || model.input.length == 0) {
            this.restaurants = await this.http.get<RestaurantDTO[]>(this.restaurantSearchUrl).toPromise();
        }
        else {
            this.restaurants = await this.http.get<RestaurantDTO[]>(this.restaurantSearchUrl + "?restaurantName=" + model.input).toPromise();
        }
    }


    /**
     * Performs searching of dishes which match form input string in name.
     * If input string is empty, all dishes are returned.
     * After fetching, data is available under `dishes` property.
     * @param model Form model with input string
     */
    async searchDishes(model: SearchForm) {

        if (model == null) {
            this.dishes = await this.http.get<DishDTO[]>(this.dishSearchUrl).toPromise();
        }
        else {
            if (model.input == null || model.input.length == 0) {
                this.dishes = await this.http.get<DishDTO[]>(this.dishSearchUrl).toPromise();
            }
            else {
                this.dishes = await this.http.get<DishDTO[]>(this.dishSearchUrl + "?dishName=" + model.input).toPromise();
            }
        }
    }

    /**
     * Search dishes for restaurant identified by ID passed.
     * @param id Restaurant ID
     * @returns Promise<Dish[]> containing dishes for given restaurant 
     */
    async searchDishesByID(id: number) {
        if (id == null) {
            console.log("Search - No dishes found. Return empty array.")
            return [];
        }
        else {
            var res;
            await this.http.get<DishDTO[]>(this.dishSearchByIDURL + id + "/dishes").toPromise().then(Response => {
                res = Response;
            });
            return res;
        }
    }
}
