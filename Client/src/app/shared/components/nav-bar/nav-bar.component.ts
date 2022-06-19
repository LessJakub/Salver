import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    host: { 'class': 'sticky top-0 z-50' },
})

export class NavBarComponent implements OnInit {

    showLoginOverlay: Boolean
    userProfBlobBaseURL = "https://salver.blob.core.windows.net/userprof/";

    profileImageURL = this.userProfBlobBaseURL;
    useSVG: boolean = false;

    constructor(public accountService: AccountService, public orderService: OrdersService) {
        this.showLoginOverlay = false
    }

    ngOnInit() {
        this.accountService.currentUser$.subscribe((user) => {
            if (user == null) {
                this.useSVG = true;
                this.profileImageURL = "";
            }
            else {
                this.useSVG = false;
                this.profileImageURL = this.userProfBlobBaseURL + user.id + ".webp";
            }
        })
    }

    noProfileImage: boolean = false


    updateURLWithDefault() {

    }

    enableLoginOverlay() {
        this.showLoginOverlay = true
    }

    logoutUser() {
        this.accountService.logoutUser();
    }

    disableLoginOverlay(eventFlag: boolean) {
        this.showLoginOverlay = eventFlag;
    }

}

