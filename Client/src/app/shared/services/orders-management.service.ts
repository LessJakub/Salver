import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/UserDTO';
import { OrderDTO } from '../models/OrderDTO';
import { AccountService } from './account.service';
import { DishDTO } from '../models/DishDTO';
import { dishesInOrderDTO } from '../models/DishesInOrderDTO';

@Injectable({
    providedIn: 'root'
})
export class OrdersManagementService {

    constructor(private http: HttpClient, private accountService: AccountService) { }

    private baseUrl: string = "http://" + location.hostname;
    private ordersUrl: string = this.baseUrl + "/api/Orders/"

    public dishAmountInOrder(dish: DishDTO, list: Array<number>): number
    {
       return list.filter(d => d == dish.id).length;
    }

    public async GetDishesFromList(list: Array<number>) {

        var dishesIds = {} as dishesInOrderDTO
        dishesIds.dishesIds = list;

        var toReturnTuples = new Array<[DishDTO, number]>();

        await this.http.post<DishDTO[]>(this.baseUrl + '/dishes', dishesIds).toPromise().then((Response: DishDTO[]) => {
            Response.forEach((dish:DishDTO) => {
                toReturnTuples.push([dish, this.dishAmountInOrder(dish, list)])
            });
    
            console.log(toReturnTuples);
        });

        return toReturnTuples;
    }


    public async GetOrders(start: number = 0, end: number = 12): Promise<Array<OrderDTO>> {
        var user: User;
        this.accountService.currentUser$.subscribe((usr: User) => {
            if (usr != null) {
                user = usr;
            }
        }, error => {
            console.error(error);
        })


        var head = new HttpHeaders().set('Authorization', 'Bearer ' + user.token);

        var params = new HttpParams()
        if (start > 0) params = params.append('startingIndex', start)
        if (end > 0) params = params.append('endIndex', end)

        var arrayToReturn: Array<OrderDTO>
        var url = this.ordersUrl
        if (user.isRestaurantOwner == 0) url += 'user'
        else url += 'restaurant'

        await this.http.get<Array<OrderDTO>>(url, { headers: head, params: params }).toPromise().then(response => {
            arrayToReturn = response;
        }, error => {
            console.error(error);
        })

        console.log(arrayToReturn)
        return arrayToReturn;
    }



    public async AcceptOrder(orderId: number, minutes: number = 60) {
        var user: User;
        this.accountService.currentUser$.subscribe((usr: User) => {
            if (usr != null) {
                user = usr;
            }

        }, error => {
            console.error(error);
        })
        if (user == null || user.isRestaurantOwner == 0) return;


        var head = new HttpHeaders().set('Authorization', 'Bearer ' + user.token);


        var url = this.ordersUrl + 'restaurant/' + orderId + '/accept';
        var res: any;
        await this.http.put(url, minutes, { headers: head }).toPromise().then(response => {
            res = response;
            console.log(response)
        }, error => {
            console.error(error);
        })

        return res;
    }

    public async CancelOrder(orderId: number) {
        var user: User;
        this.accountService.currentUser$.subscribe((usr: User) => {
            if (usr != null) {
                user = usr;
            }
        }, error => {
            console.error(error);
        })

        var head = new HttpHeaders().set('Authorization', 'Bearer ' + user.token);

        var url = this.ordersUrl + orderId + '/cancel';
        var res: any;
        await this.http.put(url, {}, { headers: head }).toPromise().then(response => {
            res = response;
        }, error => {
            console.error(error);
        })

        return res;
    }

    public async FinishOrder(orderId: number) {
        var user: User;
        this.accountService.currentUser$.subscribe((usr: User) => {
            if (usr != null) {
                user = usr;
            }
        }, error => {
            console.error(error);
        })
        if (user == null || user.isRestaurantOwner == 0) return;

        var head = new HttpHeaders().set('Authorization', 'Bearer ' + user.token);

        var url = this.ordersUrl + orderId + '/finish';
        var res: any;
        await this.http.put(url, {}, { headers: head }).toPromise().then(response => {
            res = response;
        }, error => {
            console.error(error);
        })

        return res;
    }
}
