import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { DishReviewDTO } from 'src/app/shared/models/DishReviewDTO';
import { BlobUploadService } from 'src/app/shared/services/blob-upload.service';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { ReviewsService } from 'src/app/shared/services/reviews.service';
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

    averageTotalGrade: number = 0;
    modelImageURL: string;

    reviews: DishReviewDTO[] = [];

    tabs: string[] = ["Overview", "Reviews"];

    constructor(private searchService: SearchService,
        private uploadService: BlobUploadService,
        public orderService : OrdersService,
        private reviewsService: ReviewsService) { }

    updateUrlWithDefault() {
        this.modelImageURL = this.uploadService.defaultDishImageURL();
    }

    async ngOnInit() {
        this.restaurant = this.searchService.searchRestaurantByID(this.model.appRestaurantId);
        this.modelImageURL = this.uploadService.dishImageURL(this.model.id);

        if(this.model.appRestaurantId == this.orderService.currentRestaurant)
        {
            this.orderCount = this.orderService.dishAmountInOrder(this.model);
        }

        await this.searchService.getRestaurantNameByID(this.model.appRestaurantId).then((name) => {
            if (name == null || name == "") {
                this.restaurantName = "Unknown";
            }
            else {
                this.restaurantName = name;
            }
        });
    }

    incrementCount() {
        this.orderCount += 1;
    }

    selectNewTab(selectedID: number) {
        this.selectedTabID = selectedID;

        switch(this.selectedTabID) {
            case 1:

        }
    }

    fetchReviews() {
        this.reviewsService.getDishReviews(this.model.id).toPromise().then((dishRevs: [DishReviewDTO]) => {
            this.reviews = {...dishRevs};
        })
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

            if(this.orderService.setDishAmount(this.model, this.orderCount))
            {
                this.closeOverlayAction();
            } 
            else
            {
                this.orderCount = 0
                console.log("Error while taking order.");
            }
    }
}
