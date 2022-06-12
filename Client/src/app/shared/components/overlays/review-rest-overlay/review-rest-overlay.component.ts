import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestaurantService } from 'src/app/restaurant-owner/services/restaurant.service';
import { RestaurantDTO } from 'src/app/shared/models/RestaurantDTO';
import { RestReviewDTO } from 'src/app/shared/models/RestReviewDTO';
import { BlobUploadService } from 'src/app/shared/services/blob-upload.service';
import { ReviewsService } from 'src/app/shared/services/reviews.service';

@Component({
    selector: 'app-review-rest-overlay',
    templateUrl: './review-rest-overlay.component.html',
})
export class ReviewRestOverlayComponent implements OnInit {

    @Output() closeOverlayEventEmitter = new EventEmitter();
    @Output() reloadEventEmitter = new EventEmitter();
    @Input() model: RestaurantDTO;

    error: String = "";

    reviewModel = {} as RestReviewDTO;

    constructor(private uploadService: BlobUploadService,
                private reviewsService: ReviewsService) { }

    ngOnInit(): void { }

    handleGradeChoice(event: any) {
        if (event == null) {
            console.log("Restaurant Review - Obtained empty event");
        }
        else {
            console.log("Restaurant Review - Obtained event: ");
            console.log(event);

            switch (event.name) {
                case "atmosphere":
                    this.reviewModel.atmosphereRating = event.value;
                    break;
                case "service":
                    this.reviewModel.serviceRating = event.value;
                    break;
            }
            console.log(this.reviewModel);
        }
    }

    submitAction(files) {
        console.log("Review Overlay - Submit action:");
        console.log(this.reviewModel);

        if (this.reviewModel.atmosphereRating > 0 && this.reviewModel.serviceRating > 0) {
            this.error = "";

            var reponse = this.reviewsService.addRestReview(this.model.id, this.reviewModel).toPromise().then((review) => {
                console.log("Rest Review Service - Positive response. Added:");
                console.log(review);

                if (files[0]) {
                    console.log("Rest Review - Files for upload present.")
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
