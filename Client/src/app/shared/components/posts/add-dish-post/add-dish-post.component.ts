import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RestaurantService } from 'src/app/restaurant-owner/services/restaurant.service';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { RestaurantDTO } from 'src/app/shared/models/RestaurantDTO';
import { BlobUploadService } from 'src/app/shared/services/blob-upload.service';

@Component({
    selector: 'app-add-dish-post',
    templateUrl: './add-dish-post.component.html',
})
export class AddDishPostComponent implements OnInit {

    constructor(private restaurantService: RestaurantService,
                private uploadService: BlobUploadService) { }

    @Input() model: RestaurantDTO;
    @Output() reloadEventEmitter = new EventEmitter();

    editModel: DishDTO = {} as DishDTO;

    extended = false;
    fileUploaded = false;

    ngOnInit(): void {
        this.editModel = {} as DishDTO;
    }

    fileUploadAction() {
        this.fileUploaded = true;
    }

    enableAction() {
        this.editModel = {} as DishDTO;
        this.extended = true;
    }

    handleReload(flag: boolean) {
        console.log("Handle reload:", flag);
        if (flag == true) {
            this.reloadEventEmitter.emit(true);
        }
    }

    cancelEditAction(fileInput) {
        fileInput.files = null;
        this.editModel = {} as DishDTO;
        this.fileUploaded = false;
        console.log("Menu post - Edit mode disabled.");
        this.extended = false;
    }


    submitAction(files) {
        if (this.editModel.name != null && this.editModel.name != "") {
            if (this.editModel.description != null && this.editModel.description != "") {
                if (this.editModel.price != null && this.editModel.price != NaN) {
                    if (this.editModel.ingredients != null && this.editModel.ingredients != "") {
                        if (files[0]) {
                            var response = this.restaurantService.addDish(this.model.id, this.editModel).toPromise().then((model: DishDTO) => {
                                var filename = model.id + ".webp";
                                this.uploadFiles(files, filename);

                                this.extended = false;
                                this.reloadEventEmitter.emit(true);
                            }).catch((error) => {
                                console.log(error);
                            });  
                        }
                        else
                        {
                            alert("You must upload image file to add dish.")
                        }
                    }
                }
            } 
        }
    }

    uploadFiles(files, filename: string) {
        const formData = new FormData();

        if (files[0]) {
            formData.append(files[0].filename, files[0]);
            formData.append("fileID", filename)
            formData.append("blobContainer", "dishimages");
        }

        this.uploadService
            .upload(formData)
            .subscribe(({ path }) => (console.log(path)), (error : HttpErrorResponse) => {
                alert("Error occured while uploding the file. Try with smaller image or wait a few minutes.")
            });
    }
}
