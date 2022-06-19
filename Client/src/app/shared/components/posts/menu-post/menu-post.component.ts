import { HttpHeaderResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { RestaurantService } from 'src/app/restaurant-owner/services/restaurant.service';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { DELETION_TYPE } from '../../overlays/delete-dish-overlay/delete-dish-overlay.component';

@Component({
    selector: 'app-menu-post',
    templateUrl: './menu-post.component.html',
})

export class MenuPostComponent implements OnInit {

    constructor(private restaurantService: RestaurantService,
                private orderService: OrdersService) { 
    }

    showDeleteOverlay: boolean = false;
    showNewDishOverlay: boolean = false;
    showNewReviewOverlay: boolean = false;

    orderCount: number = 0;

    incrementCount() {
        this.orderCount += 1;
    }

    decrementCount() {
        if (this.orderCount - 1 >= 0) {
            this.orderCount -= 1;
        }
    }

    takeOrder() {
        if(this.orderService.setDishAmount(this.model, this.orderCount)) {} 
        else
        {
            this.orderCount = 0
            console.log("Error while taking order.");
        }
    }

    public deletionTypes = DELETION_TYPE;

    deleteAction() {
        this.showDeleteOverlay = true;
    }

    @Input() model: DishDTO;
    @Input() isOwner: boolean = false;
    @Output() reloadEventEmitter = new EventEmitter();

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
    handleReload(flag: boolean) {
        console.log("Handle reload:", flag);
        if (flag == true) {
            this.reloadEventEmitter.emit(true);
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

    emitReload(flag: boolean) {
        this.reloadEventEmitter.emit(flag);
    }

    addReviewAction() {
        this.invertReviewOverlayFlag();
    }
    
    disableDeleteOverlay(eventFlag: boolean) {
        this.showDeleteOverlay = eventFlag;
    }

    invertDeleteOverlayFlag() {
        this.showDeleteOverlay = !this.showDeleteOverlay;
    }

    disableReviewOverlay(eventFlag: boolean) {
        this.showNewReviewOverlay = eventFlag;
    }

    invertReviewOverlayFlag() {
        this.showNewReviewOverlay = !this.showNewReviewOverlay;
    }

}
