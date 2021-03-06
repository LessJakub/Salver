import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestaurantService } from 'src/app/restaurant-owner/services/restaurant.service';
import { PostDTO } from 'src/app/shared/models/PostDTO';
import { BlobUploadService } from 'src/app/shared/services/blob-upload.service';
import { ReviewsService } from 'src/app/shared/services/reviews.service';
import { DishReviewDTO } from 'src/app/shared/models/DishReviewDTO';
import { DELETION_TYPE } from '../../overlays/delete-dish-overlay/delete-dish-overlay.component';
import { ActivityDTO, ActivityType } from 'src/app/shared/models/ActivityDTO';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { HttpErrorResponse } from '@angular/common/http';

export enum POST_TYPE {
    REST_REVIEW = 0,
    DISH_REVIEW = 1,
    REGULAR_POST = 2,
    USER_POST = 3,
}

@Component({
    selector: 'app-adjustable-post',
    templateUrl: './adjustable-post.component.html',
})
export class AdjustablePostComponent implements OnInit {

    public deletionTypes = DELETION_TYPE; 
    public activityTypes = ActivityType;

    @Input() public type: POST_TYPE = POST_TYPE.REGULAR_POST;
    @Input() model: any;

    @Output() reloadEventEmitter = new EventEmitter();

    @Input() isOwner = false;
    @Input() isReviewer: boolean = false;

    showDeleteOverlay = false;

    postBlobBaseURL = "https://salver.blob.core.windows.net/posts/";
    routerLink: string = '';
    postImageURL: string = "";
    creatorName: string = '';

    defaultIMG = "/assets/images/dishHldr.webp";

    updateUrlWithDefault() {
        this.postImageURL = this.defaultIMG;
        this.dishReviewImageURL = this.defaultIMG;
        this.restReviewImageURL = this.defaultIMG;
    }

    async markAsSpam() {
        await this.adminService.markAsSpam(this.model.id, this.model.type)
        this.reloadEventEmitter.emit(true);
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

    test: [string: number][];

    constructor(private profileService: ProfileService,
                private uploadService: BlobUploadService,
                private restaurantService: RestaurantService,
                private reviewsService: ReviewsService,
                private adminService: AdminService) {}

    ngOnInit() {
        
        if (this.type == 1) {
            if (this.isDishReview(this.model)) {
                let tempModel = {...this.model};
                this.compactMode = true;

                let newModel: ActivityDTO = {
                    id: tempModel.id,
                    type: this.activityTypes.DISH_REVIEW,
                    ratings: [],
                    date: undefined,
                    likes: undefined,
                    description: tempModel.description,
                    creatorId: tempModel.userId,
                    topicId: tempModel.dishId
                }
                this.grades[0] = tempModel.tasteRating;
                this.grades[1] = tempModel.priceRating;
                this.grades[2] = tempModel.serviceRating;
                this.model = newModel;
            }
            else {
                this.compactMode = false;
                this.grades[0] = this.model.ratings[2]['item2']
                this.grades[1] = this.model.ratings[0]['item2']
                this.grades[2] = this.model.ratings[1]['item2']
            }
            this.dishReviewImageURL = this.dishReviewBaseURL + this.model.id + ".webp";

            this.postLink = this.routerLink = '/restaurant/' + this.model.appRestaurantId;

            this.userProfileLink = "/user/" + this.model.creatorId;

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
            this.postDeletionType = this.deletionTypes.REGULAR_POST;
        }

        else if (this.type == 3) {
            this.postImageURL = this.postBlobBaseURL + this.model.id + ".webp";

            if (this.model.username != null) {
                this.postName = this.model.username;
                this.postLink = this.routerLink = '/user/' + this.model.creatorId;
            }
            else {
                this.postLink = this.routerLink = '/user/' + this.model.creatorId;
                this.getUserNameFromID(this.model.creatorId);
                this.postName = this.userName;
            }
            this.postDeletionType = this.deletionTypes.USER_POST;
        }

        else if (this.type == 0) {
            this.userProfileLink = "/user/" + this.model.creatorId;
            this.getUserNameFromID(this.model.creatorId);
            this.getRestaurantNameFromID(this.model.topicId);
            this.restReviewImageURL = this.restReviewBaseURL + this.model.id + ".webp";
            this.restProfileLink = "/restaurant/" + this.model.topicId; 
        }
    }

    isDishReview(arg: any): arg is DishReviewDTO {
        console.log("Check type")
        return typeof arg?.tasteRating === "number";
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

    async deleteReview(type: number) {
        if (type == 1) {
            console.log("Dish review - Delete");
            await this.profileService.deleteDishReview(this.model.topicId, this.model.id);
        }
        if (type == 0) {
            console.log("Restaurant review - Delete");
            await this.profileService.deleteRestaurantReview(this.model.topicId, this.model.id);
        }
        this.reloadEventEmitter.emit(true);
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

        var service = (this.type == POST_TYPE.USER_POST) ? this.profileService : this.restaurantService;
        var postCreator = (this.model.appRestaurantId == null) ? this.model.creatorId : this.model.appRestaurantId;
        var response = service.editPost(postCreator, this.model.id, this.editModelRegular).toPromise().then((updatedPost) => {
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
            .subscribe(({ path }) => (console.log(path)), (error : HttpErrorResponse) => {
                alert("Error occured while uploding the file. Try with smaller image or wait a few minutes.")
            });
    }

    cancelEditRegular(files) {
        files = null;
        this.editModelRegular = {} as PostDTO;
        this.editModeRegular = false;
    }


    // DISH REVIEW
    compactMode: boolean = false;
    editModeDishRev: boolean = false;
    dishReviewBaseURL: string = "https://salver.blob.core.windows.net/dishreviews/"
    dishReviewImageURL: string;
    dishName: string = "...";
    userName: string = "...";
    grades: number[] = [];
    userProfileLink: string;


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


    // RESTAURANT REVIEW
    restReviewBaseURL: string = "https://salver.blob.core.windows.net/resimages/";
    restReviewImageURL: string = "";
    restProfileLink: string = "*";
    
    
    // SHARED
    ownsReview: boolean = false;
    postDeletionType: DELETION_TYPE;

    // USER POST

}
