import { HttpHeaderResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestaurantService } from 'src/app/restaurant-owner/services/restaurant.service';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { RestaurantDTO } from 'src/app/shared/models/RestaurantDTO';
import { BlobUploadService } from 'src/app/shared/services/blob-upload.service';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
    selector: 'app-delete-dish-overlay',
    templateUrl: './delete-dish-overlay.component.html',
})
export class DeleteDishOverlayComponent implements OnInit {

    @Output() closeOverlayEventEmitter = new EventEmitter();
    @Output() reloadEventEmitter = new EventEmitter();
    @Input() model: DishDTO;

    ngOnInit(): void { }

    constructor(private searchService: SearchService,
                private restaurantService: RestaurantService,
                private uploadService: BlobUploadService) { }

    closeOverlayAction() {
        this.closeOverlayEventEmitter.emit(false);
    }

    cancelAction() {
        console.log("Cancel action");
        this.closeOverlayAction();
    }

    deleteAction() {
        console.log("Delete action");

        var response = this.restaurantService.removeDish(this.model.id, this.model.appRestaurantId).toPromise().then((response: HttpHeaderResponse) => {
            this.reloadEventEmitter.emit(true);
            this.closeOverlayAction();
        }).catch((error) => {
            console.log(error);
        });
    }    

}
