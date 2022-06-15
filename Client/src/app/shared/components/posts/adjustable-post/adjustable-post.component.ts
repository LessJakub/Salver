import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestaurantService } from 'src/app/restaurant-owner/services/restaurant.service';
import { PostDTO } from 'src/app/shared/models/PostDTO';
import { BlobUploadService } from 'src/app/shared/services/blob-upload.service';
import { SearchService } from 'src/app/shared/services/search.service';

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

    @Input() public type: POST_TYPE = POST_TYPE.REGULAR_POST;
    @Input() model: PostDTO;

    @Output() reloadEventEmitter = new EventEmitter();

    @Input() isOwner = false;

    postBlobBaseURL = "https://salver.blob.core.windows.net/posts/";
    routerLink: string = '';
    postImageURL: string = "";
    creatorName: string = '';

    updateUrlWithDefault() {

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
                private restaurantService: RestaurantService) { }

    ngOnInit() {
        this.postImageURL = this.postBlobBaseURL + this.model.id + ".webp";
        //If post was created by restaurant
        if(this.model.appRestaurantId != 0) 
        {
            this.routerLink = '/restaurant/' + this.model.appRestaurantId
            this.creatorName = this.model.name
        }
        else
        {
            this.routerLink = '/activity/'
            this.creatorName = this.model.username
        }
    }


    // REGULAR
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

}
