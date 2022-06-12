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

    showDeleteOverlay: boolean = false;
    showNewDishOverlay: boolean = false;
    showNewReviewOverlay: boolean = false;

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
