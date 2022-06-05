import { Component, Input, OnInit } from '@angular/core';
import { Dish } from 'src/app/models/Dish';

@Component({
    selector: 'app-menu-post',
    templateUrl: './menu-post.component.html',
})

export class MenuPostComponent implements OnInit {

    constructor() { }

    @Input() model: Dish;

    orderCount: number = 0;

    ngOnInit(): void {
    }

    incrementCount() {
        this.orderCount += 1;
    }

    decrementCount() {
        this.orderCount -= 1;
    }

    takeOrder() { }

}
