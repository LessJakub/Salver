import { Component, Input, OnInit } from '@angular/core';
import { DishDTO } from 'src/app/shared/models/DishDTO';
import { BlobUploadService } from 'src/app/shared/services/blob-upload.service';

@Component({
    selector: 'app-dish-tile',
    template: `

        <app-dish-overlay *ngIf="(!this.imageUploader && showOverlay)" [model]="model" (closeOverlayEventEmitter)="disableLoginOverlay()"></app-dish-overlay>

        <div (click)="invertOverlayFlag()" class="flex w-fit h-fit justify-center items-center content-center flex-col cursor-pointer group">

        <input (change)="this.uploadFiles(fileInput.files)" hidden #fileInput type="file" requiredFileType="image/webp" id="file"/>

        <div *ngIf="(this.imageUploader) == false" class="flex h-60 w-60">
            <img class="mx-auto w-fit h-auto object-cover rounded-full group-hover:saturate-200 transition" [src]="this.modelImageURL" (error)="updateUrlWithDefault()">
            <div class="grid grid-cols-1 gap-2 h-full justify-center content-center px-0.5">
                <!-- TODO: Use this grade system in other places (Make a component for it) -->
                <ng-container *ngFor="let _ of [].constructor(5 - this.averageTotalGrade)">
                    <div class="w-5 h-5 border border-green-700 rounded-full group-hover:saturate-200 transition"></div>
                </ng-container>

                <ng-container *ngFor="let _ of [].constructor(this.averageTotalGrade); let i = index">
                    <div class="w-5 h-5 bg-green-700 rounded-full group-hover:saturate-200 transition"></div>
                </ng-container>
            </div>
        </div> 
        
        <div (click)="fileInput.click()" *ngIf="(this.imageUploader) == true" class="flex h-60 w-60">
            <img class="mx-auto w-fit h-auto object-cover rounded-full group-hover:animate-pulse" [src]="this.modelImageURL" (error)="updateUrlWithDefault()">
            <div class="grid grid-cols-1 gap-2 h-full justify-center content-center px-0.5">
                <!-- TODO: Use this grade system in other places (Make a component for it) -->
                <ng-container *ngFor="let _ of [].constructor(5 - this.averageTotalGrade)">
                    <div class="w-5 h-5 border border-green-700 rounded-full group-hover:saturate-200 transition"></div>
                </ng-container>

                <ng-container *ngFor="let _ of [].constructor(this.averageTotalGrade); let i = index">
                    <div class="w-5 h-5 bg-green-700 rounded-full group-hover:saturate-200 transition"></div>
                </ng-container>
            </div>
</div>
  
        <div *ngIf="showDescription == true" class="p-2 items-center content-center justify-center text-center w-60">
            <div class="w-full justify-between flex gap-2">
                <p class="text-2xl font-bold truncate">{{model.name}}</p>
                <p class="text-2xl font-bold">{{model.price}}{{currencySymbol}}</p>
            </div>
            <p class="text-md font-normal truncate">{{model.description}}</p>
        </div>
    </div>
`,
})


export class DishTileComponent implements OnInit {

    @Input() model: DishDTO;
    @Input() showDescription: Boolean = true;
    @Input() imageUploader: Boolean = false;

    showOverlay: boolean = false;

    defaultIMG = "/assets/images/dishHldr.webp";
    imgBaseURL = "https://salver.blob.core.windows.net/dishimages/";
    modelImageURL;

    averageTotalGrade: number = 0;

    currencySymbol: string = "$"

    constructor(private uploadService: BlobUploadService) { }

    updateUrlWithDefault() {
        this.modelImageURL = this.defaultIMG
    }

    ngOnInit(): void {
        this.averageTotalGrade = Math.round(this.model.totalGrade);
        if (this.model.id == null) {
            this.modelImageURL = this.defaultIMG;
        }
        else {
            this.modelImageURL = this.imgBaseURL + this.model.id + ".webp"
        }

    }

    invertOverlayFlag() {
        if (this.imageUploader == false) {
            this.showOverlay = !this.showOverlay;
        }
    }

    uploadFiles(files) {
        console.log("Upload service - Upload files")
        const formData = new FormData();

        if (files[0]) {
            var filename = this.model.id + ".webp"
            console.log(filename)
            formData.append(files[0].filename, files[0]);
            formData.append("fileID", filename)
            formData.append("blobContainer", "dishimages");

            this.uploadService
            .upload(formData)
            .subscribe(({ path }) => (console.log(path)));
        }
        else {
            console.log("Upload service - Files empty");
        }
    }

    disableLoginOverlay(eventFlag: boolean) {
        this.showOverlay = eventFlag;
    }

}