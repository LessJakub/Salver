import { Component, OnInit } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { AccountService } from './shared/services/account.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    host: { 'class': 'flex flex-col grow' }
})

export class AppComponent implements OnInit {

    isLogged = false;
    constructor(private metaService: Meta, private accountService: AccountService) { }

    ngOnInit() {
        this.isLogged = this.accountService.isLoggedIn();
    }
}