import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivityDTO } from '../models/ActivityDTO';
import { PostDTO } from '../models/PostDTO';
import { User } from '../models/UserDTO';
import { UserProfileDTO } from '../models/UserProfileDTO';
import { AccountService } from './account.service';


@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    private baseURL: string = "http://" + location.hostname;
    private usersURL: string = this.baseURL + ":8080/api/Users/"

    constructor(private accountService: AccountService,
        private http: HttpClient) { }


    /**
     * Method used to obtain public data for user identified with ID.
     * @param id ID of the user of interest
     * @returns Promise of UserProfileDTO.
     */
    async getUserProfile(id: number): Promise<UserProfileDTO> {

        // Obtain user token for authentication
        var userToken;
        this.accountService.currentUser$.subscribe((user: User) => {
            if (user != null) {
                userToken = user.token;
            }
        })

        var url = this.usersURL + id;
        return await this.http.get<UserProfileDTO>(url, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken) }).toPromise();
    }


    /**
     * Method used to obtain public data for user identified with ID.
     * @param id ID of the user of interest
     * @returns Promise of UserProfileDTO.
     */
    async getUserActivity(id: number) {

        // Obtain user token for authentication
        var userToken;
        this.accountService.currentUser$.subscribe((user: User) => {
            if (user != null) {
                userToken = user.token;
            }
        })

        var url = this.usersURL + id + "/activity";
        return await this.http.get<ActivityDTO[]>(url, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken) }).toPromise();
    }

    addPost(id: number, model: PostDTO) {
        // Obtain user token for authentication
        var userToken;
        var authToken = this.accountService.currentUser$.subscribe((user: User) => {
            if (user != null && user.token != null) {
                userToken = user.token;
            }
        })

        var url = this.baseURL + ":8080/api/Posts/Users/" + id + "/posts"
        return this.http.post<PostDTO>(url, model, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken) }).pipe(
            map((Response: PostDTO) => {
                return Response;
            }, error => {
                console.log(error);
            }));
    }


    /**
     * Method used for evaluation whether currently logged in user follows user with ID.
     * @param id User ID which can be followed by the user.
     * @returns Boolean response whether logged user follows user identified with ID.
     */
    async followsUser(id: number) {
        if (id == null || id == NaN || this.accountService.currentUser$ == null) {
            return false
        }
        else {
            var returnedFlag = false;
            // Obtain user token for authentication
            var userToken;
            var authToken = this.accountService.currentUser$.subscribe((user: User) => {
                if (user != null && user.token != null) {
                    userToken = user.token;
                }
            })

            var url = this.usersURL + "follows-user?id=" + id;
            var response = await this.http.get<boolean>(url, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken) }).toPromise().then((resp: boolean) => {
                returnedFlag = resp;
                console.log("Resp: " + resp);
            })
            console.log("Follows user: ");
            console.log(returnedFlag);
            return returnedFlag;
        }
    }

    /**
     * Attempts to use follow endpoint for user identified with token, to follow user identified by ID.
     * @param id User ID
     * @returns Request response
     */
    async followUser(id: number) {

        if (id == null || id == NaN) {
            return false
        }
        else {
            // Obtain user token for authentication
            var userToken;
            var authToken = this.accountService.currentUser$.subscribe((user: User) => {
                if (user != null && user.token != null) {
                    userToken = user.token;
                }
            })

            var url = this.usersURL + id + "/follow";
            return await this.http.post(url, {}, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken) }).toPromise();
        }
    }

    /**
     * Attempts to use unfollow endpoint for user identified with token, to unfollow user identified by ID.
     * @param id User ID
     * @returns Request response
     */
    async unfollowUser(id: number) {

        if (id == null || id == NaN) {
            return false
        }
        else {
            // Obtain user token for authentication
            var userToken;
            var authToken = this.accountService.currentUser$.subscribe((user: User) => {
                if (user != null && user.token != null) {
                    userToken = user.token;
                }
            })

            var url = this.usersURL + id + "/unfollow";
            return await this.http.delete(url, { headers: new HttpHeaders().set('Authorization', 'Bearer ' + userToken) }).toPromise();
        }
    }
}
