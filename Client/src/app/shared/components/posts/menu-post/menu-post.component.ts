import { Component, Input, OnInit } from '@angular/core';
import { DishDTO } from 'src/app/shared/models/DishDTO';

@Component({
    selector: 'app-menu-post',
    templateUrl: './menu-post.component.html',
})

export class MenuPostComponent implements OnInit {

    constructor() { }

    showOverlay: boolean = false;

    @Input() model: DishDTO;
    @Input() adder: boolean = false;

    orderCount: number = 0;

    ngOnInit(): void {
    }

    incrementCount() {
        this.orderCount += 1;
    }

    decrementCount() {
        this.orderCount -= 1;
    }

    adderAction() {
        console.log("Add new dish action");
    }

    invertOverlayFlag() {
        this.showOverlay = !this.showOverlay;
    }
    
    disableLoginOverlay(eventFlag: boolean) {
        this.showOverlay = eventFlag;
    }

    takeOrder() { }

}
