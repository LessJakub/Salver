import { Component } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  host: {'class': 'sticky top-0 z-50'},
})

export class NavBarComponent {

    showLoginOverlay: Boolean

    constructor(public accountService: AccountService, public orderService : OrdersService) {
    // Set to true to see login overlay
        this.showLoginOverlay = false
    }

    enableLoginOverlay() {
        this.showLoginOverlay = true
    }

    logoutUser() {
        this.accountService.logoutUser();
    }

    disableLoginOverlay(eventFlag:boolean) {
        this.showLoginOverlay = eventFlag;
    }
  
}

