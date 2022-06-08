import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestaurantDTO } from 'src/app/shared/models/RestaurantDTO';

@Component({
    selector: 'app-add-dish-post',
    templateUrl: './add-dish-post.component.html',
})
export class AddDishPostComponent implements OnInit {

    constructor() { }

    @Input() model: RestaurantDTO;
    @Output() reloadEventEmitter = new EventEmitter();

    ngOnInit(): void {
    }

    invertOverlayFlag() {
        this.showOverlay = !this.showOverlay;
    }
    
    disableLoginOverlay(eventFlag: boolean) {
        this.showOverlay = eventFlag;
    }

    handleReload(flag: boolean) {
        console.log("Handle reload:", flag);
        if (flag == true) {
            this.reloadEventEmitter.emit(true);
        }
    }

    showOverlay: boolean = false;

    adderAction() {
        console.log("Add new dish action");
    }
}
