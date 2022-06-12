import { HttpHeaderResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { RestaurantService } from 'src/app/restaurant-owner/services/restaurant.service';
import { DishDTO } from 'src/app/shared/models/DishDTO';

@Component({
    selector: 'app-menu-post',
    templateUrl: './menu-post.component.html',
})

export class MenuPostComponent implements OnInit {

    constructor(private restaurantService: RestaurantService) { 

    }

    showOverlay: boolean = false;

    @Input() model: DishDTO;
    @Input() isOwner: boolean = false;
    @Output() reloadEventEmitter = new EventEmitter();

    orderCount: number = 0;

    ngOnInit(): void {
        this.editModel = {...this.model};
    }

    editModel: DishDTO;
    editMode: boolean = false;
    editButtonAction() {
        console.log("Menu post - Edit button action.");  
        if (this.isOwner == true) {
            this.editModel = {...this.model};
            this.editMode = true;
        }
        else {
            console.log("You are not an owner.")
        }
    }
    
    cancelEditAction() {
        console.log("Menu post - Edit mode disabled.");
        this.editMode = false;
    }

    async submitEditAction() {
        console.log("Menu post - Submit action.");
        this.editModel = await this.restaurantService.editDish(this.model.id, this.model.appRestaurantId, this.editModel);
        this.cancelEditAction();
        this.emitReload(true);
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
