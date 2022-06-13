import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersManagementService {

  constructor(private http: HttpClient, private accountService : AccountService) { }


  public async GetOrders()
  {
    
  }
}
