import { emitDistinctChangesOnlyDefaultValue } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { RestaurantDTO } from 'src/app/shared/models/RestaurantDTO';
import { BlobUploadService } from 'src/app/shared/services/blob-upload.service';
import { SearchService } from 'src/app/shared/services/search.service';

import { RestaurantService } from 'src/app/restaurant-owner/services/restaurant.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-new-meal-overlay',
    templateUrl: './new-meal-overlay.component.html',
})
export class NewMealOverlayComponent implements OnInit {

    @Output() closeOverlayEventEmitter = new EventEmitter();
    @Output() reloadEventEmitter = new EventEmitter();
    @Input() model: RestaurantDTO;

    dishModel: any = {};

    modelImageURL = "";
    filename: string;
    imageSource: string;

    imageProvided = false;

    ngOnInit(): void {}

    constructor(private searchService: SearchService,
                private uploadService: BlobUploadService,
                private restaurantService: RestaurantService) { }


    updateUrlWithDefault() {
        this.modelImageURL = this.uploadService.defaultDishImageURL();
    }

    setFilename(files) {
        if (files[0]) {
            // this.filename = files[0].name;
        }
    }

    submitAction(files) {
        console.log("Submit action");
        console.log(this.dishModel);
        if (this.dishModel.name != null && this.dishModel.name != "") {
            if (this.dishModel.description != null && this.dishModel.description != "") {
                if (this.dishModel.price != null && this.dishModel.price != NaN) {
                    if (this.dishModel.ingredients != null && this.dishModel.ingredients != "") {
                        if (files[0]) {
                            var response = this.restaurantService.addDish(this.model.id, this.dishModel).toPromise().then((model: DishDTO) => {
                                console.log("Response - Model")
                                console.log(model);
                                this.filename = model.id + ".webp";
                                console.log("Eureka");
                                console.log(model);
                                this.uploadFiles(files);

                                this.reloadEventEmitter.emit(true);
                                this.closeOverlayEventEmitter.emit(false);
                            }).catch((error) => {
                                console.log(error);
                            }); 
                        }
                        else
                        {
                            alert("You must upload image first.")
                        }
                    }
                }
            } 
        }
    }

    uploadFiles(files) {
        const formData = new FormData();

        if (files[0]) {
            formData.append(files[0].filename, files[0]);
            formData.append("fileID", this.filename)
            formData.append("blobContainer", "dishimages");
        }

        this.uploadService
            .upload(formData)
            .subscribe(({ path }) => (this.imageSource = path), 
            (error : HttpErrorResponse) => {
                alert("Error occured while uploding the file. Try with smaller image or wait a few minutes.")
            });

        console.log(this.imageSource);
    }

}
