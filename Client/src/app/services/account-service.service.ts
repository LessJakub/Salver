import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRouteReuseStrategy } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { User } from '../models/User';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

    baseUrl: string = "http://localhost:8080/api/"
    loginUrl: string = this.baseUrl + "account/login"

    private loggedInStatus: boolean = false;

    constructor(private http: HttpClient) {
        const localUserString = localStorage.getItem("user");
        console.log(localUserString)
        if (localUserString != null && localUserString.length > 0) {
            try{
                const localUser = JSON.parse(localUserString);
                
                console.log(localUser)
                if (localUser != null) {
                    this.currentUserSource.next(localUser);
                    this.loggedInStatus = true;
                }
            }
            catch{
                console.log("error")
            }
            
        }
    }

    private currentUserSource = new ReplaySubject<User>()

    currentUser$ = this.currentUserSource.asObservable();

    loginRequest(model: any) {
        return this.http.post(this.loginUrl, model).pipe (
            map((Response: User) => {
                const user = Response

                if (user) {
                    localStorage.setItem("user", JSON.stringify(user));
                    this.currentUserSource.next(user);
                    this.loggedInStatus = true;
                }
                console.log(user);
            })
        )
    }

    logoutUser() {
        localStorage.removeItem("user");
        this.currentUserSource.next(null);
        this.loggedInStatus = false;
    }

    isLoggedIn(): boolean {
        return this.loggedInStatus;
    }

}
