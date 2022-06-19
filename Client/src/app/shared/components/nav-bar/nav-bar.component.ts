import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    resProfBlobBaseURL = "https://salver.blob.core.windows.net/resprof/";

    profileImageURL = this.userProfBlobBaseURL;
    resProfileImageURL = this.resProfBlobBaseURL;
    useSVG: boolean = false;

    constructor(public accountService: AccountService, public orderService: OrdersService,
                public router: Router) {
        this.showLoginOverlay = false
    }

    ngOnInit() {
        this.accountService.currentUser$.subscribe((user) => {
            if (user == null) {
                this.useSVG = true;
                this.profileImageURL = "";
                this.resProfileImageURL = "";
            }
            else {
                this.useSVG = false;
                this.profileImageURL = this.userProfBlobBaseURL + user.id + ".webp";
                this.resProfileImageURL = this.resProfBlobBaseURL + user.isRestaurantOwner + ".webp";
            }
        })
    }

    redirectToUser() {
        var url: string;
        var userID = this.accountService.currentUser$.subscribe((user) => {
            if (user == null) {
                url = "/*"
            }
            else {
                url = "/user/" + user.id;
            }
        })

        this.redirectTo(url);
    }

    redirectToRestaurant() {
        var url: string;
        var userID = this.accountService.currentUser$.subscribe((user) => {
            if (user == null) {
                url = "/*"
            }
            else {
                url = "/restaurant/" + user.isRestaurantOwner;
            }
        })

        this.redirectTo(url);
    }

    redirectTo(url: string){
        this.router.navigateByUrl('*', {skipLocationChange: true}).then(()=>
        this.router.navigate([url]));
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

