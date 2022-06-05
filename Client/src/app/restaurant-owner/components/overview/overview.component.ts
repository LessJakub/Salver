import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    host: { 'class': 'flex-auto flex justify-center items-center' } // ! Styling host container to fill all avialable space
})
export class OverviewComponent implements OnInit {

    constructor() { }


    selectedTabID: number = 0;

    ngOnInit(): void {
    }

    getUserRestaurant(id: number) {

    }

}
