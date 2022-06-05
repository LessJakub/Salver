import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
})

export class FooterComponent implements OnInit {

    constructor(public accountService: AccountService) { }

    ngOnInit(): void { }

}
