import { HttpHeaderResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestaurantService } from 'src/app/restaurant-owner/services/restaurant.service';
import { ActivityDTO } from 'src/app/shared/models/ActivityDTO';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { PostDTO } from 'src/app/shared/models/PostDTO';
import { RestaurantDTO } from 'src/app/shared/models/RestaurantDTO';
import { BlobUploadService } from 'src/app/shared/services/blob-upload.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { SearchService } from 'src/app/shared/services/search.service';

export enum DELETION_TYPE {
    DISH_MENU = 0,
    REGULAR_POST = 1,
    USER_POST = 2,
}


@Component({
    selector: 'app-delete-dish-overlay',
    templateUrl: './delete-dish-overlay.component.html',
})
export class DeleteDishOverlayComponent implements OnInit {

    @Output() closeOverlayEventEmitter = new EventEmitter();
    @Output() reloadEventEmitter = new EventEmitter();
    
    @Input() modelDish: DishDTO;
    @Input() modelRegPost: PostDTO;
    @Input() modelActivity: ActivityDTO;
    @Input() deleteType: DELETION_TYPE;

    ngOnInit(): void { }

    constructor(private restaurantService: RestaurantService,
                private profileService: ProfileService) { }

    closeOverlayAction() {
        this.closeOverlayEventEmitter.emit(false);
    }

    cancelAction() {
        console.log("Cancel action");
        this.closeOverlayAction();
    }

    deleteAction() {
        switch(this.deleteType) {
            case DELETION_TYPE.REGULAR_POST:
                this.deletePost();
                break;
            case DELETION_TYPE.DISH_MENU:
                this.deleteDish();
                break;
            case DELETION_TYPE.USER_POST:
                this.deleteUserPost();
                break;
        }
    }

    private deleteUserPost() {
        console.log("Post - Delete action");

        var response = this.profileService.deletePost(this.modelActivity.creatorId, this.modelActivity.id).toPromise().then((resp) => {
            console.log("Delete Post - Success");
            console.log(resp);
            this.reloadEventEmitter.emit(true);
            this.closeOverlayAction();
        }).catch((error) => {
            console.log(error);
        });
    }

    private deletePost() {
        console.log("Post - Delete action");

        var response = this.restaurantService.deletePost(this.modelRegPost.appRestaurantId, this.modelRegPost.id).toPromise().then((resp) => {
            console.log("Delete Post - Success");
            console.log(resp);
            this.reloadEventEmitter.emit(true);
            this.closeOverlayAction();
        }).catch((error) => {
            console.log(error);
        });
    }

    private deleteDish() {
        console.log("Dish - Delete action");

        var response = this.restaurantService.removeDish(this.modelDish.id, this.modelDish.appRestaurantId).toPromise().then((response: HttpHeaderResponse) => {
            this.reloadEventEmitter.emit(true);
            this.closeOverlayAction();
        }).catch((error) => {
            console.log(error);
        });
    }    

}
