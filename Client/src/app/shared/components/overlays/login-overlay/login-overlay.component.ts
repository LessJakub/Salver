import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from 'src/app/shared/services/account.service';

@Component({
    selector: 'app-login-overlay',
    templateUrl: './login-overlay.component.html'
})

export class LoginOverlayComponent implements OnInit {

    @Output() closeOverlayEventEmitter = new EventEmitter();

    model: any = {}

    error: string = null;

    constructor(public service: AccountService, private router: Router) { }

    ngOnInit(): void { }

    closeOverlayAction() {
        this.closeOverlayEventEmitter.emit(false);
    }

    loginAction() {
        this.service.loginRequest(this.model).subscribe(Response => {
            console.log("Login action used.");
            this.closeOverlayAction();

            if (this.service.restaurantOwner) {
                this.router.navigate(['overview']);
            }
            else {
                this.router.navigate(['activity']);
            }


        }, error => {
            this.error = error.error;
            console.log(error);
        })
    }

}

