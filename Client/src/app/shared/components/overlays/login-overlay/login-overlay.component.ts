import { HttpErrorResponse } from '@angular/common/http';
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

    error: Array<string> = new Array<string>();

    constructor(public service: AccountService, private router: Router) { }

    ngOnInit(): void { }

    closeOverlayAction() {
        this.closeOverlayEventEmitter.emit(false);
    }

    loginAction() {
        this.service.loginRequest(this.model).subscribe(Response => {
            console.log("Login action used.");
            this.closeOverlayAction();

            if (this.service.ownerID != 0) {
                this.router.navigate(['overview']);
            }
            else {
                if (this.service.IsAdmin) {
                    this.router.navigate(['spam']);
                }
                else {
                    this.router.navigate(['activity']);
                }
            }


        }, (error: HttpErrorResponse) => {
            this.handleError(error)
        })
    }

    registerAction(){
        this.service.registerRequest(this.model).subscribe(Response => {
            console.log("Register action used.");
            this.closeOverlayAction();

            if (this.service.ownerID != 0) {
                this.router.navigate(['overview']);
            }
            else {
                if (this.service.IsAdmin) {
                    this.router.navigate(['spam']);
                }
                else {
                    this.router.navigate(['activity']);
                }
            }


        }, (error: HttpErrorResponse) => {
            this.handleError(error)
        })
    }

    private handleError(error: HttpErrorResponse)
    {
        this.error = new Array<string>();
        if(error.error.errors != null)
        {
            for(var e in error.error.errors)
            {
                this.error.push(error.error.errors[e]);
            }
        }
        else
        {
            this.error.push(error.error)
        }
        
    }

}

