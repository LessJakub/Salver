import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RestaurantService } from "src/app/restaurant-owner/services/restaurant.service";
import { PostDTO } from "src/app/shared/models/PostDTO";
import { RestaurantDTO } from 'src/app/shared/models/RestaurantDTO';
import { BlobUploadService } from "src/app/shared/services/blob-upload.service";
import { ProfileService } from "src/app/shared/services/profile.service";
import { POST_TYPE } from "../adjustable-post/adjustable-post.component";

export enum ADD_POST_TYPE {
    USER = 0,
    RESTAURANT = 1,
}

@Component({
    selector: 'app-add-rest-post',
    templateUrl: './add-rest-post.component.html',
})
export class AddRestPostComponent implements OnInit {

    constructor(public uploadService: BlobUploadService,
                public restaurantService: RestaurantService,
                public profileService: ProfileService) { }

    @Input() model: any;
    @Input() postType: ADD_POST_TYPE = ADD_POST_TYPE.RESTAURANT;
    @Output() reloadEventEmitter = new EventEmitter();

    types = ADD_POST_TYPE;

    extended = false;

    editModel: PostDTO = {} as PostDTO;

    fileUploaded = false;
    public fileUploadAction(files) {
        if (files[0]) {
            this.fileUploaded = true;
        }
    }

    public submitAction(files) {
        console.log("Add Post - Submit action:");
        console.log(this.editModel);

        if (this.editModel.description != null && this.editModel.description != "") {
            
            var choosenService = (this.postType == ADD_POST_TYPE.RESTAURANT) ? this.restaurantService : this.profileService;
            var response = choosenService.addPost(this.model.id, this.editModel).toPromise().then((newPost) => {
                console.log("Add Post - Positive response. Added:");
                console.log(newPost);

                if (files[0]) {
                    console.log("Add Post - Files for upload present.")
                    var filename = newPost.id + ".webp";
                    this.uploadFiles(files, filename);
                }
                else {
                    console.log("Review - No files uploaded.");
                }

                this.reloadEventEmitter.emit(true);
                this.cancelAction(files);
            }).catch((error) => {
                console.log("Add Post - Error:");
                console.log(error);
            })
        }
        else {
            console.log("Add Post - Description can't be null or empty");
        }
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

    currentDate = new Date();

    enableAction() {
        this.extended = true;
    }

    cancelAction(fileInput) {
        this.extended = false;
        this.fileUploaded = false;
        fileInput.files = null;
    }

    ngOnInit(): void {}

    handleReload(flag: boolean) {
        console.log("Handle reload:", flag);
        if (flag == true) {
            this.reloadEventEmitter.emit(true);
        }
    }


    public prettyTimeFromDate(time: Date): string {
        var date = new Date(time);
        return date.toLocaleDateString(navigator.language, {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
        });
    }
}
