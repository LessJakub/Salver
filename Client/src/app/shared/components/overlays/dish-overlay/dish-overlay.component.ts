import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivityType } from 'src/app/shared/models/ActivityDTO';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { DishReviewDTO } from 'src/app/shared/models/DishReviewDTO';
import { BlobUploadService } from 'src/app/shared/services/blob-upload.service';
import { OrdersService } from 'src/app/shared/services/orders.service';
import { ReviewsService } from 'src/app/shared/services/reviews.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { POST_TYPE } from '../../posts/adjustable-post/adjustable-post.component';

@Component({
    selector: 'app-dish-overlay',
    templateUrl: './dish-overlay.component.html'
})
export class DishOverlayComponent implements OnInit {

    @Output() closeOverlayEventEmitter = new EventEmitter();
    @Input() model: DishDTO;

    orderCount: number = 0;
    selectedTabID: number = 0;

    averageTotalGrade: number = 0;
    modelImageURL: string;

    public postTypes = POST_TYPE; 
    public activityTypes = ActivityType; 

    public reviews: DishReviewDTO[] = [];

    tabs: string[] = ["Overview", "Reviews"];

    constructor(private searchService: SearchService,
        private uploadService: BlobUploadService,
        public orderService : OrdersService,
        private reviewsService: ReviewsService) { }

    updateUrlWithDefault() {
        this.modelImageURL = this.uploadService.defaultDishImageURL();
    }

    async ngOnInit() {
        // this.restaurant = this.searchService.searchRestaurantByID(this.model.appRestaurantId);
        this.modelImageURL = this.uploadService.dishImageURL(this.model.id);

        if(this.model.appRestaurantId == this.orderService.currentRestaurant)
        {
            this.orderCount = this.orderService.dishAmountInOrder(this.model);
        }

        this.fetchReviews();
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

    async fetchReviews() {
        await this.reviewsService.getDishReviews(this.model.id).then((dishRevs) => {
            this.reviews = dishRevs;
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
