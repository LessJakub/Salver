import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivityDTO } from '../models/ActivityDTO';
import { PostDTO } from '../models/PostDTO';
import { User } from '../models/UserDTO';
import { AccountService } from './account.service';

@Injectable({
    providedIn: 'root'
})
export class ActivityService {

    constructor(private http: HttpClient, private accountService: AccountService) { }

    private baseUrl: string = "http://" + location.hostname;
    private restaurantUrl: string = this.baseUrl + ":8080/api/Restaurants/"
    private userUrl: string = this.baseUrl + ":8080/api/Users/"


    public async getRestaurantActivities(id: number, skipCount: number = 0, itemsCount: number = 2): Promise<ActivityDTO[]> {
        var act;
        var params = new HttpParams();
        params = params.append("startingIndex", skipCount);
        params = params.append("endIndex", itemsCount);

        await this.http.get<Array<ActivityDTO>>(this.restaurantUrl + id + '/activity', { params: params }).toPromise().then((response: Array<ActivityDTO>) => {
            act = response;
        }, error => {
            console.error(error);
        })

        return act;
    }

    public async getUserActivities(skipCount: number = 0, itemsCount: number = 5): Promise<ActivityDTO[]> {

        var params = new HttpParams();
        params = params.append("startingIndex", skipCount);
        params = params.append("endIndex", itemsCount);

        var user: User;
        this.accountService.currentUser$.subscribe((usr: User) => {
            if (usr != null) {
                user = usr;
            }
        }, error => {
            console.error(error);
        })

        var head = new HttpHeaders().set('Authorization', 'Bearer ' + user.token);

        var act;
        await this.http.get<Array<ActivityDTO>>(this.userUrl + 'activity', { headers: head, params: params }).toPromise().then((response: Array<ActivityDTO>) => {
            act = response;
        }, error => {
            console.error(error);
        })

        return act;

    }
}
