import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRouteReuseStrategy } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/UserDTO';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

    // Obtain true hostname URL (fixes issue where we need to connect to API on non-local host)
    private baseUrl: string = "http://" + location.hostname;
    private loginUrl: string = this.baseUrl + ":8080/api/account/login"
    private registerUrl: string = this.baseUrl + ":8080/api/account/register"
    private followURL: string = this.baseUrl + ":8080/api/Restaurants/"

    private loggedInStatus: boolean = false;
    ownerID: number = 0;

    constructor(private http: HttpClient) {
        this.init();
    }

    private init(){
        const localUserString = localStorage.getItem("user");
        console.log(localUserString)
        if (localUserString != null && localUserString.length > 0) {
            try{
                const localUser = JSON.parse(localUserString);
                
                console.log(localUser)
                if (localUser != null) {
                    this.currentUserSource.next(localUser);
                    this.loggedInStatus = true;
                    this.ownerID = localUser.isRestaurantOwner;
                }
            }
            catch{
                console.log("error")
            }
            
        }
    }

    private currentUserSource = new ReplaySubject<User>()

    public currentUser$ = this.currentUserSource.asObservable();

    loginRequest(model: any) {
        return this.http.post(this.loginUrl, model).pipe(
            map((Response: User) => {
                const user = Response

                if (user) {
                    localStorage.setItem("user", JSON.stringify(user));
                    this.currentUserSource.next(user);
                    this.loggedInStatus = true;
                    this.ownerID = user.isRestaurantOwner;
                }
                console.log(user);
            })
        )
    }

    registerRequest(model: any) {
        return this.http.post(this.registerUrl, model).pipe(
            map((Response: User) => {
                const user = Response

                if (user) {
                    localStorage.setItem("user", JSON.stringify(user));
                    this.currentUserSource.next(user);
                    this.loggedInStatus = true;
                    this.ownerID = user.isRestaurantOwner;
                }
                console.log(user);
            })
        )
    }

    async logoutUser() {
        localStorage.removeItem("user");
        this.currentUserSource.next(null);
        this.currentUser$ = this.currentUserSource.asObservable();
        this.loggedInStatus = false;
        this.ownerID = 0;
    }

    isLoggedIn(): boolean {
        return this.loggedInStatus;
    }


    /**
     * Attempts to use follow endpoint for user identified with token, to follow restaurant identified by ID.
     * @param id Restaurant ID
     * @returns Request response
     */
    async followRestaurant(id: number) {

        if (id == null || id == NaN) {
            return false
        }
        else {
            // Obtain user token for authentication
            var userToken;
            var authToken = this.currentUser$.subscribe((user: User) => {
                if(user != null && user.token != null)
                {
                    userToken = user.token;
                }
            })
            console.log(userToken);
            return await this.http.get(this.followURL + id + "/follow", { headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken) }).toPromise();
        }
    }

    /**
     * Attempts to use follow endpoint for user identified with token, to unfollow restaurant identified by ID.
     * @param id Restaurant ID
     * @returns Request response
     */
    async unfollowRestaurant(id: number) {

        if (id == null || id == NaN) {
            return
        }
        else {
            // Obtain user token for authentication
            var userToken;
            var authToken = this.currentUser$.subscribe((user: User) => {
                if(user != null && user.token != null){
                    userToken = user.token;
                }
            })
            var res;
            var response = await this.http.delete(this.followURL + id + "/unfollow", { headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken) }).toPromise().then(Response => {
                res = Response;
            });
            return res;
        }
    }

    async followsRestaurant(id : number) {
        if (id == null || id == NaN || this.currentUser$ == null) {
            return false
        }
        else {
            var returnedFlag = false;
            // Obtain user token for authentication
            var userToken;
            var authToken = this.currentUser$.subscribe((user: User) => {
                if(user != null && user.token != null)
                {
                userToken = user.token;
                }
                
            })
            var response = await this.http.get<boolean>(this.baseUrl + ":8080/api/Users/follows-restaurant?id=" + id, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken) }).toPromise().then((resp : boolean) => {
                returnedFlag = resp;
            })
            return returnedFlag;
        }
    }

}
