import { Injectable } from '@angular/core';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { User } from 'src/app/shared/models/UserDTO';
import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/shared/services/account.service';
import { tokenize } from '@angular/compiler/src/ml_parser/lexer';
import { RestaurantDTO } from 'src/app/shared/models/RestaurantDTO';
import { PostDTO } from 'src/app/shared/models/PostDTO';
import { Post } from 'src/app/models/post';

@Injectable({
    providedIn: 'root'
})
export class RestaurantService {

    // Obtain true hostname URL (fixes issue where we need to connect to API on non-local host)
    private baseUrl: string = "http://" + location.hostname;
    private addDishURL: string = this.baseUrl + ":8080/api/Dishes/Restaurants/"
    private restaurantsURL: string = this.baseUrl + ":8080/api/Restaurants/"
    private postURL: string = this.baseUrl + ":8080/api/Posts/Restaurants/"

    constructor(private http: HttpClient, private accountService: AccountService) { }

    addDish(id: number, model: DishDTO) {

        var idontcare;
        var authToken = this.accountService.currentUser$.subscribe((user: User) => {
            console.log(user);
            idontcare = user.token;
            console.log(idontcare);
        })
        return this.http.post<DishDTO>(this.addDishURL + id + "/dishes", model,{headers: new HttpHeaders().set('Authorization', 'Bearer ' + idontcare)}).pipe(
            map((Response: DishDTO) => {
                return Response;
            }, error => {
                console.log(error);
            }));
    }

    /**
     * Method used to add post to restaurant with given ID.
     * @param id Restaurant ID
     * @param model Model of Post to be added
     */
    addPost(id: number, model: PostDTO) {
        // Obtain user token for authentication
        var userToken;
        var authToken = this.accountService.currentUser$.subscribe((user: User) => {
            userToken = user.token;
        })

        return this.http.post<PostDTO>(this.postURL + id + "/posts", model, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken)}).pipe(
            map((Response: PostDTO) => {
                return Response;
            }, error => {
                console.log(error);
            }));
    }

    /**
     * Method used to update information contained within post.
     * @param id Identifier of restaurant owning the post
     * @param postID Updated post ID
     * @param model Model with information about updates
     * @returns Response
     */
    editPost(id: number, postID: number, model: PostDTO) {
        // Obtain user token for authentication
        var userToken;
        var authToken = this.accountService.currentUser$.subscribe((user: User) => {
            userToken = user.token;
        })

        return this.http.put<PostDTO>(this.postURL + id + "/posts/" + postID, model, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken)}).pipe(
            map((Response: PostDTO) => {
                return Response;
            }, error => {
                console.log(error);
            }));
    }

    removeDish(dishID: number, restaurantID: number) {

        // Obtain user token for authentication
        var userToken;
        var authToken = this.accountService.currentUser$.subscribe((user: User) => {
            userToken = user.token;
        })

        return this.http.delete(this.addDishURL + restaurantID + "/dishes/" + dishID, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken)}).pipe(
            map((Response: HttpHeaderResponse) => {
                return Response;
            }, error => {
                console.log(error);
            }));
    }

    async editDish(dishID: number, restaurantID: number, updatedModel: DishDTO): Promise<DishDTO> {

        // Obtain user token for authentication
        var userToken;
        var authToken = this.accountService.currentUser$.subscribe((user: User) => {
            userToken = user.token;
        })

        var response = await this.http.put<DishDTO>(this.addDishURL + restaurantID + "/dishes/" + dishID, updatedModel, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken)}).pipe(
            map((Response: DishDTO) =>{
                const resp = Response;
                console.log(resp);
                return resp;
            }, error => {
                console.log(error)
            })
        );

        return response.toPromise();
    }

    async editDetails(restaurantID: number, updatedModel: RestaurantDTO): Promise<RestaurantDTO> {

        // Obtain user token for authentication
        var userToken;
        var authToken = this.accountService.currentUser$.subscribe((user: User) => {
            userToken = user.token;
        })

        var response = await this.http.put<RestaurantDTO>(this.restaurantsURL + restaurantID, updatedModel, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken)}).pipe(
            map((Response: RestaurantDTO) =>{
                const resp = Response;
                console.log(resp);
                return resp;
            }, error => {
                console.log(error)
            })
        );

        return response.toPromise();
    }

}
