import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BlobUploadService } from '../../services/blob-upload.service';

@Component({
    selector: 'app-debug-upload-page',
    template: `
<div class="w-full h-full flex">
    <div class="flex flex-col space-y-10 w-1/2 h-full items-center justify-center content-center px-10 py-5 overflow-y-scroll">
        <div class="w-full h-fit ">
            <p class="font-bold text-4xl text-green-900">DEBUG UPLOAD PANEL</p>
            <p class="font-normal text-xl text-gray-900">Upload files directly to blob storage.</p>
            <p class="font-semibold text-xl text-gray-900">Make sure that filename matches with ID!</p>

            <p *ngIf="(wrongContainer)" class="font-semibold text-xl text-red-800">Select proper container!</p>
        </div>

        <div class="w-full h-fit">
            <select [(ngModel)]="blobContainer" name="blob" id="blob" class="cursor-pointer block text-sm appearance-none w-full rounded-2xl bg-gray-200 border border-gray-200 text-gray-700 py-3 px-12 leading-tight focus:outline-none focus:bg-gray-200 focus:border-green-700">
                <option value="" selected disabled>Select container</option>
                <option>dishimages</option>
                <option>dishreviews</option>
                <option>posts</option>
                <option>resimages</option>
                <option>resprof</option>
                <option>userprof</option>
            </select>
        </div>

        <div class="w-full h-fit flex space-x-5">
            <input hidden #fileInput type="file" id="file" (change)="setFilename(fileInput.files)"/>
            <button class="w-1/2 h-fit px-5 py-2 bg-green-900 text-gray-50 shadow-md rounded-2xl" type="button" (click)="fileInput.click()">Choose File</button>
            <button class="w-1/2 h-fit px-5 py-2 bg-green-900 text-gray-50 shadow-md rounded-2xl hover:bg-red-800" type="button" (click)="uploadFiles(fileInput.files)">Upload</button>
        </div>

        <div class="w-full h-fit">
            <p class="text-xl font-bold text-gray-900">Details:</p>
            <p class="text-xl text-gray-700">Filename: {{ filename }}</p>
            <p class="text-xl text-gray-700">Blob container: {{ blobContainer }}</p>
            <div class="overflow-clip overflow-x-auto">
                <p class="text-xl text-gray-700">Access path: {{ imageSource }}</p>
            </div>
        </div>

    </div>

    <div class="flex flex-col space-y-10 w-1/2 h-full items-center justify-center content-center px-10 py-5 overflow-y-scroll">
        <img class="aspect-square w-[50%] max-h-screen rounded-2xl overflow-hidden resize object-cover" [src]="imageSource"/>
    </div>    
</div>
    
  `,
    host: { 'class': 'flex-auto flex justify-center items-center' } // ! Styling host container to fill all avialable space
})
export class DebugUploadPageComponent implements OnInit {

    filename = '';
    blobContainer: any = "";
    imageSource = '';
    wrongContainer: boolean = false;

    constructor(private uploadService: BlobUploadService) { }

    ngOnInit(): void { }

    setFilename(files) {
        if (files[0]) {
            this.filename = files[0].name;
            console.log(this.filename);
        }
    }

    uploadFiles(files) {
        if (this.blobContainer == null || this.blobContainer == "") {
            this.wrongContainer = true;
        }
        else {
            const formData = new FormData();

            if (files[0]) {
                formData.append(files[0].name, files[0]);
                formData.append("fileID", files[0].name);
                formData.append("blobContainer", this.blobContainer);
            }

            this.uploadService
                .upload(formData)
                .subscribe(({ path }) => (this.imageSource = path));
        }
    }

}