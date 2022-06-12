import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestaurantService } from 'src/app/restaurant-owner/services/restaurant.service';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { DishReviewDTO } from 'src/app/shared/models/DishReviewDTO';
import { RestaurantDTO } from 'src/app/shared/models/RestaurantDTO';
import { BlobUploadService } from 'src/app/shared/services/blob-upload.service';
import { ReviewsService } from 'src/app/shared/services/reviews.service';

@Component({
    selector: 'app-review-dish-overlay',
    templateUrl: './review-dish-overlay.component.html'
})
export class ReviewDishOverlayComponent implements OnInit {

    @Output() closeOverlayEventEmitter = new EventEmitter();
    @Output() reloadEventEmitter = new EventEmitter();
    @Input() model: DishDTO;

    error: String = "";

    reviewModel = {} as DishReviewDTO;

    constructor(private uploadService: BlobUploadService,
                private restaurantService: RestaurantService,
                private reviewsService: ReviewsService) { }

    ngOnInit(): void {}

    handleGradeChoice(event: any) {
        if (event == null) {
            console.log("Review - Obtained empty event");
        }
        else {
            console.log("Review - Obtained event: ");
            console.log(event);

            switch (event.name) {
                case "price":
                    this.reviewModel.priceRating = event.value;
                    break;
                case "service":
                    this.reviewModel.serviceRating = event.value;
                    break;
                case "taste":
                    this.reviewModel.tasteRating = event.value;
            }
            console.log(this.reviewModel);
        }
    }

    submitAction(files) {
        console.log("Review Overlay - Submit action:");
        console.log(this.reviewModel);

        if (this.reviewModel.priceRating > 0 && this.reviewModel.serviceRating > 0 && this.reviewModel.tasteRating > 0) {
            this.error = "";
            
            var reponse = this.reviewsService.addDishReview(this.model.id, this.reviewModel).toPromise().then((review) => {
                console.log("Review Service - Positive response. Added:");
                console.log(review);

                if (files[0]) {
                    console.log("Review - Files for upload present.")
                    var filename = review.id + ".webp";
                    this.uploadFiles(files, filename);
                }
                else {
                    console.log("Review - No files uploaded.");
                }
                this.reloadEventEmitter.emit(true);
                this.closeOverlayEventEmitter.emit(false);
            }).catch((error) => {
                console.log("Review - Error:");
                console.log(error);
            })
        }
        else {
            this.error = "Please fill all grades.";
        }
    }

    uploadFiles(files, filename: string) {
        const formData = new FormData();

        if (files[0]) {
            formData.append(files[0].filename, files[0]);
            formData.append("fileID", filename)
            formData.append("blobContainer", "dishreviews");
        }

        this.uploadService
            .upload(formData)
            .subscribe(({ path }) => (console.log(path)));
    }

    

}
