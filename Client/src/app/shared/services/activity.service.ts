import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivityDTO } from '../models/ActivityDTO';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private http: HttpClient) { }

  private baseUrl: string = "http://" + location.hostname;
  private activitiesUrl: string = this.baseUrl + ":8080/api/Restaurants/"

  activities: Array<ActivityDTO>

  public async getActivities(id : number)
  {
      await this.http.get<Array<ActivityDTO>>(this.activitiesUrl + id + '/activity').toPromise().then((response: Array<ActivityDTO>) => {
        this.activities = response;
      }, error => {
        console.error(error);
      })

      console.log(this.activities);
  }
}
