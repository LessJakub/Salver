import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Dish } from 'src/app/models/Dish';
import { TabSwitcherComponent } from 'src/app/utilities/tab-switcher/tab-switcher.component';

@Component({
  selector: 'app-dish-overlay',
  templateUrl: './dish-overlay.component.html'
})
export class DishOverlayComponent implements OnInit {

    @Output() closeOverlayEventEmitter = new EventEmitter();

    @Input() model: Dish;

    orderCount: number = 0;
    selectedTabID: number = 0;

    tabs: string[] = ["Overview", "Reviews"];

    constructor() {}
    ngOnInit(): void {}

    incrementCount() {
        this.orderCount += 1;
    }

    selectNewTab(selectedID: number) {
        this.selectedTabID = selectedID;
    }

    decrementCount() {
        if (this.orderCount - 1 >= 0) {
            this.orderCount -= 1;
        }
    }

    closeOverlayAction() {
        this.closeOverlayEventEmitter.emit(false);
    }

    takeOrder() {
        if (this.orderCount === 0) {
            this.closeOverlayAction();
        }
    }
}
