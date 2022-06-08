import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DishDTO } from 'src/app/shared/models/DishDTO';

@Component({
    selector: 'app-menu-post',
    templateUrl: './menu-post.component.html',
})

export class MenuPostComponent implements OnInit {

    constructor() { }

    showOverlay: boolean = false;

    @Input() model: DishDTO;
    @Input() isOwner: boolean = false;
    @Output() reloadEventEmitter = new EventEmitter();

    orderCount: number = 0;

    ngOnInit(): void {
    }

    incrementCount() {
        this.orderCount += 1;
    }

    decrementCount() {
        this.orderCount -= 1;
    }

    emitReload(flag: boolean) {
        this.reloadEventEmitter.emit(flag);
    }

    // TODO: Complete add review action in menu post
    addReviewAction() {
        console.log("UNIMPLEMENTED - Add review to dish action")
    }

    // TODO: Complete add review action in menu post
    deleteAction() {
        console.log("UNIMPLEMENTED - Add delete dish action")
    }

    invertOverlayFlag() {
        this.showOverlay = !this.showOverlay;
    }
    
    disableLoginOverlay(eventFlag: boolean) {
        this.showOverlay = eventFlag;
    }

    takeOrder() { }

}
