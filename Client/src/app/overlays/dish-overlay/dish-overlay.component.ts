import { Component, Input, OnInit } from '@angular/core';
import { Dish } from 'src/app/models/Dish';

@Component({
  selector: 'app-dish-overlay',
  templateUrl: './dish-overlay.component.html'
})
export class DishOverlayComponent implements OnInit {

    @Input() model: Dish;

    orderCount: number = 0;

    constructor() {}
    ngOnInit(): void {}

    incrementCount() {
        this.orderCount += 1;
    }

    decrementCount() {
        if (this.orderCount - 1 >= 0) {
            this.orderCount -= 1;
        }
    }
}
