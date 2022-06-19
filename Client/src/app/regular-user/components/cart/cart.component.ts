import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/shared/services/account.service';
import { OrdersService } from 'src/app/shared/services/orders.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
  
})
export class CartComponent implements OnInit {

  constructor(public orderService: OrdersService,
              private accountService: AccountService) { }

  ngOnInit(): void {
    this.orderService.UpdateCart();
  }

}
