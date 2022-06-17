import { HttpClient, HttpHeaders } from '@angular/common/http';
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


  public async getRestaurantActivities(id : number) : Promise<ActivityDTO[]>
  {
    var act;
      await this.http.get<Array<ActivityDTO>>(this.restaurantUrl + id + '/activity').toPromise().then((response: Array<ActivityDTO>) => {
        act = response;
      }, error => {
        console.error(error);
      })

      return act;
  }

  public async getUserActivities() : Promise<PostDTO[]>
  {
    var user: User;
    this.accountService.currentUser$.subscribe( (usr: User) => {
        if(usr != null)
        {
          user = usr;
        }
    }, error => {
      console.error(error);
    })

    var head = new HttpHeaders().set('Authorization', 'Bearer ' + user.token);

    var act;
      await this.http.get<Array<PostDTO>>(this.userUrl + 'activity', {headers: head}).toPromise().then((response: Array<PostDTO>) => {
        act = response;
      }, error => {
        console.error(error);
      })

      return act;

  }
}
