import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantDTO } from 'src/app/shared/models/RestaurantDTO';
import { AccountService } from 'src/app/shared/services/account.service';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    host: { 'class': 'flex-auto flex justify-center items-center' } // ! Styling host container to fill all avialable space
})

export class OverviewComponent implements OnInit {

    model: RestaurantDTO = null;

    constructor(private searchService: SearchService,
                private accountService: AccountService,
                private router: Router
    ) { }

    ngOnInit(): void {
        this.router.navigate(['/restaurant/' + this.accountService.ownerID]);
    }

}
