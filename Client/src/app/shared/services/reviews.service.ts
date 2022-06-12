import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DishReviewDTO } from '../models/DishReviewDTO';
import { RestReviewDTO } from '../models/RestReviewDTO';
import { User } from '../models/UserDTO';
import { AccountService } from './account.service';

@Injectable({
    providedIn: 'root'
})
export class ReviewsService {

    private baseUrl: string = "http://" + location.hostname;
    private dishReviewURL: string = this.baseUrl + ":8080/api/Reviews/dishes/"
    private restReviewURL: string = this.baseUrl + ":8080/api/Reviews/Restaurants/"

    constructor(private accountService: AccountService,
                private http: HttpClient) { }

    /**
     * Method used to add new dish review for given dish identified by ID.
     * @param id Dish id for which review should be added
     * @param model Model of the review to add
     * @returns Response as a promise
     */
    addDishReview(id: number, model: DishReviewDTO) {

        // Obtain user token for authentication
        var userToken;
        var authToken = this.accountService.currentUser$.subscribe((user: User) => {
            userToken = user.token;
        })

        return this.http.post<DishReviewDTO>(this.dishReviewURL + id + "/reviews", model, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken) }).pipe(
            map((Response: DishReviewDTO) => {
                return Response;
            }, error => {
                console.log(error);
        }));
    }


    /**
     * Method used to add new review for restaurant identified by ID.
     * @param id Restaurant id for which review should be added
     * @param model Model of the review to add
     * @returns Response as a promise
     */
     addRestReview(id: number, model: RestReviewDTO) {

        // Obtain user token for authentication
        var userToken;
        var authToken = this.accountService.currentUser$.subscribe((user: User) => {
            userToken = user.token;
        })

        return this.http.post<RestReviewDTO>(this.restReviewURL + id + "/reviews", model, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken) }).pipe(
            map((Response: RestReviewDTO) => {
                return Response;
            }, error => {
                console.log(error);
        }));
    }




    /**
     * Method used to get all dish reviews for given dish identified by ID.
     * @param id Dish id for which review should be added
     * @param model Model of the review to add
     * @returns Response as a promise
     */
     getDishReviews(id: number) {
        var url = this.baseUrl + ":8080/api/Reviews/dishes" + id + "reviews";
        return this.http.get<DishReviewDTO[]>(url).pipe(
            map((Response: DishReviewDTO[]) => {
                return Response;
            }, error => {
                console.log(error);
        }));
    }
}
