import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivityDTO, ActivityType } from '../models/ActivityDTO';
import { User } from '../models/UserDTO';
import { AccountService } from './account.service';

enum ReviewType{
  DISH_REVIEW,
  RESTAURANT_REVIEW
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private accountService: AccountService) { }

  private baseUrl: string = "http://" + location.hostname;
  private adminUrl: string = this.baseUrl + ":8080/api/admin/"
  private spamUrl: string = this.adminUrl + "spam"

  private dishReviews: string = this.spamUrl + "/dish-reviews"
  private restReviews: string = this.spamUrl + "/restaurant-reviews"

  public async ClearDishReviewSpamMark(id: number)
  {
    return await this.ClearSpamMark(id, ReviewType.DISH_REVIEW);
  }

  public async ClearRestaurantReviewSpamMark(id: number)
  {
    return await this.ClearSpamMark(id, ReviewType.RESTAURANT_REVIEW);
  }

  public async ClearSpamMark(id: number, type: ReviewType)
  {
    var token;
    this.accountService.currentUser$.subscribe((user: User) => {
    if(user != null)
    {
      token = user.token;
    }})

    var url = "";
    if(type == ReviewType.DISH_REVIEW) url = this.dishReviews;
    else if(type == ReviewType.RESTAURANT_REVIEW) url = this.restReviews;
    else return;
    
    var head = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    await this.http.put(url + '/' + id , {}, { headers: head}).pipe(
            map((Response: any) =>{
              console.log(Response); 
            }, error => {
              console.log(error)
            }
          )).toPromise();
  }

  public async DeleteDishReview(id: number)
  {
    return await this.DeleteReview(id, ActivityType.DISH_REVIEW);
  }

  public async DeleteRestaurantReview(id: number)
  {
    return await this.DeleteReview(id, ActivityType.RESTAURANT_REVIEW);
  }

  public async DeleteReview(id: number, type: ActivityType)
  {
    var token;
    this.accountService.currentUser$.subscribe((user: User) => {
    if(user != null)
    {
      token = user.token;
    }})

    var url = "";
    if(type == ActivityType.DISH_REVIEW) url = this.dishReviews;
    else if(type == ActivityType.RESTAURANT_REVIEW) url = this.restReviews;
    else return;

    
    var head = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    await this.http.delete(url + '/' + id , { headers: head}).pipe(
            map((Response: any) =>{
              console.log(Response); 
            }, error => {
              console.log(error)
            }
          )).toPromise();
  }

  public async getSpam(): Promise<Array<ActivityDTO>>
  {
    var token;
    this.accountService.currentUser$.subscribe((user: User) => {
    if(user != null)
    {
      token = user.token;
    }})
    
    var head = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    var listToRet = new Array<ActivityDTO>();

    await this.http.get(this.spamUrl , { headers: head}).pipe(
            map((Response: Array<ActivityDTO>) =>{
              console.log(Response);
              Response.forEach((a: ActivityDTO) => {
                listToRet.push(a);
              })
            }, error => {
              console.log(error)
            }
          )).toPromise();

      return listToRet;
  }
  
  public async markDishReviewAsSpam(id: number)
  {
    return await this.markAsSpam(id, ActivityType.DISH_REVIEW);
  }

  public async markRestaurantReviewAsSpam(id: number)
  {
    return await this.markAsSpam(id, ActivityType.RESTAURANT_REVIEW);
  }

  private async markAsSpam(id: number, type: ActivityType)
  {
    var token;
    this.accountService.currentUser$.subscribe((user: User) => {
    if(user != null)
    {
      token = user.token;
    }})

    var url = "";
    if(type == ActivityType.DISH_REVIEW) url = this.dishReviews;
    else if(type == ActivityType.RESTAURANT_REVIEW) url = this.restReviews;
    else return;

    var params = new HttpParams()
    params = params.append('id', id)
    
    var head = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    await this.http.post(url , {}, {params:params, headers: head}).pipe(
            map((Response: any) =>{
              console.log(Response);
            }, error => {
              console.log(error)
            }
          )).toPromise();
  }
}
