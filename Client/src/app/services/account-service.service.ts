import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseRouteReuseStrategy } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { User } from '../models/User';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountServiceService {

    baseUrl: string = "http://localhost:8080/api/"
    loginUrl: string = this.baseUrl + "account/login"

    constructor(private http: HttpClient) {
        const localUserString = localStorage.getItem("user");
        if (localUserString != null) {
            const localUser = JSON.parse(localUserString);
            if (localUser != null) {
                this.currentUserSource.next(localUser);
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
                }

                console.log(user);
            })
        )
    }

    logoutUser() {
        localStorage.removeItem("user");
        this.currentUserSource.next(null);
    }

}
