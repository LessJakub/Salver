import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestaurantService } from 'src/app/restaurant-owner/services/restaurant.service';
import { PostDTO } from 'src/app/shared/models/PostDTO';
import { BlobUploadService } from 'src/app/shared/services/blob-upload.service';
import { ReviewsService } from 'src/app/shared/services/reviews.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { DELETION_TYPE } from '../../overlays/delete-dish-overlay/delete-dish-overlay.component';

export enum POST_TYPE {
    REST_REVIEW = 0,
    DISH_REVIEW = 1,
    REGULAR_POST = 2
}

@Component({
    selector: 'app-adjustable-post',
    templateUrl: './adjustable-post.component.html',
})
export class AdjustablePostComponent implements OnInit {

    public deletionTypes = DELETION_TYPE;    

    @Input() public type: POST_TYPE = POST_TYPE.REGULAR_POST;
    @Input() model: any;

    @Output() reloadEventEmitter = new EventEmitter();

    @Input() isOwner = false;

    showDeleteOverlay = false;

    postBlobBaseURL = "https://salver.blob.core.windows.net/posts/";
    routerLink: string = '';
    postImageURL: string = "";
    creatorName: string = '';

    updateUrlWithDefault() {

    }

    disableDeleteOverlay(eventFlag: boolean) {
        this.showDeleteOverlay = eventFlag;
    }

    public prettyTimeFromDate(time: Date): string {
        var date = new Date(time);
        return date.toLocaleDateString(navigator.language, {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
        });
    }

    constructor(private searchService: SearchService,
                private uploadService: BlobUploadService,
                private restaurantService: RestaurantService,
                private reviewsService: ReviewsService) {}

    ngOnInit() {
        
        if (this.type == 1) {
            this.dishReviewImageURL = this.dishReviewBaseURL + this.model.id + ".webp";

            this.getDishNameFromID(this.model.topicId);
            this.getUserNameFromID(this.model.creatorId);
        }
        else if (this.type == 2) {
            this.postImageURL = this.postBlobBaseURL + this.model.id + ".webp";

            if (this.model.name != null) {
                this.postName = this.model.name;
                this.postLink = this.routerLink = '/restaurant/' + this.model.appRestaurantId;
            }
            else {
                this.postLink = this.routerLink = '/restaurant/' + this.model.creatorId;
                this.getRestaurantNameFromID(this.model.creatorId);
            }
        }
    }


    // REGULAR
    postName: string = "..."
    postLink: string = this.routerLink = '/**';
    editModelRegular: PostDTO;
    editModeRegular = false;
    deleteOverlayRegular = false;
    editRegularAction() {
        this.editModelRegular = {...this.model};
        this.editModeRegular = true;
    }

    deleteRegularAction() {
        this.deleteOverlayRegular = true;
    }

    getRestaurantNameFromID(id: number) {
        console.log("Get restaurant name for ID: " + id);
        if (id != null || id != NaN) {
            this.reviewsService.getRestaurantNameFromID(id).then((restaurant) => {
                console.log("Returned username: " + restaurant.name);
                this.postName = restaurant.name;
            }).catch((error) => {
                console.log("Get restaurant - Error:");
                console.log(error);
                this.postName = "Unknown";
            });
        }
        else {
            this.postName = "Invalid ID";
        }   
    }

    submitEditRegular(files) {
        console.log("Edit Action: ID - " + this.model.id);

        var response = this.restaurantService.editPost(this.model.appRestaurantId, this.model.id, this.editModelRegular).toPromise().then((updatedPost) => {
            console.log("Edit Post - Positive response:");
            console.log(updatedPost);

            if (files[0]) {
                console.log("Edit Post - Files for upload present.")
                var filename = this.model.id + ".webp";
                this.uploadFiles(files, filename);
            }

            this.cancelEditRegular(files);
            this.reloadEventEmitter.emit(true);
        }).catch((error) => {
            console.log("Edit Post - Update error:")
            console.log(error);
        })
    }

    private uploadFiles(files, filename: string) {
        const formData = new FormData();

        if (files[0]) {
            formData.append(files[0].filename, files[0]);
            formData.append("fileID", filename)
            formData.append("blobContainer", "posts");
        }

        this.uploadService
            .upload(formData)
            .subscribe(({ path }) => (console.log(path)));
    }

    cancelEditRegular(files) {
        files = null;
        this.editModelRegular = {} as PostDTO;
        this.editModeRegular = false;
    }


    // DISH REVIEW
    editModeDishRev: boolean = false;
    isReviewer: boolean = false;
    dishReviewBaseURL: string = "https://salver.blob.core.windows.net/dishreviews/"
    dishReviewImageURL: string;
    dishName: string = "...";
    userName: string = "...";


    getDishNameFromID(id: number) {
        console.log("Get name for ID: " + id);
        if (id != null || id != NaN) {
            this.reviewsService.getDishNameFromID(id).then((dish) => {
                console.log("Returned name: " + dish.name);
                this.dishName = dish.name;
            }).catch((error) => {
                console.log("Get Dish Name - Error:");
                console.log(error);
                this.dishName = "Not found";
            });
        }
        else {
            this.dishName = "Wrong ID";
        }  
    }


    getUserNameFromID(id: number) {
        console.log("Get username for ID: " + id);
        if (id != null || id != NaN) {
            this.reviewsService.getUserNameFromID(id).then((user) => {
                console.log("Returned username: " + user.username);
                this.userName = user.username;
            }).catch((error) => {
                console.log("Get userName - Error:");
                console.log(error);
                this.userName = "Unknown";
            });
        }
        else {
            this.userName = "Invalid ID";
        }   
    }
}
