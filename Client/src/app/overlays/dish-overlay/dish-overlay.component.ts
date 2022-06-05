import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UploadService } from 'src/app/services/upload.service';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
    selector: 'app-dish-overlay',
    templateUrl: './dish-overlay.component.html'
})
export class DishOverlayComponent implements OnInit {

    @Output() closeOverlayEventEmitter = new EventEmitter();
    @Input() model: DishDTO;

    // Data fetched from services for model
    restaurant;

    restaurantName: string;

    orderCount: number = 0;
    selectedTabID: number = 0;
    modelImageURL: string;

    tabs: string[] = ["Overview", "Reviews"];

    constructor(private searchService: SearchService,
        private uploadService: UploadService) { }

    updateUrlWithDefault() {
        this.modelImageURL = this.uploadService.defaultDishImageURL();
    }

    ngOnInit(): void {
        this.restaurant = this.searchService.searchRestaurantByID(this.model.appRestaurantId);
        this.modelImageURL = this.uploadService.dishImageURL(this.model.id);

        this.searchService.getRestaurantNameByID(this.model.appRestaurantId).then((name: string) => {
            this.restaurantName = name;
        }).catch((error) => {
            console.log(error);
            this.restaurantName = "Unknown";
        });
    }

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
