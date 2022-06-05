import { Component, Input, OnInit } from '@angular/core';
import { Dish } from 'src/app/models/Dish';
import { DishDTO } from 'src/app/models/DishDTO';
import { DishOverlayComponent } from 'src/app/overlays/dish-overlay/dish-overlay.component';

@Component({
  selector: 'app-search-tile',
  template: `

    <app-dish-overlay *ngIf="(showOverlay) == true" [model]="model" (closeOverlayEventEmitter)="disableLoginOverlay()"></app-dish-overlay>

    <div (click)="invertOverlayFlag()" class="flex w-fit h-fit justify-center items-center content-center flex-col cursor-pointer group">

        <div class="flex h-60 w-60">
            <img class="mx-auto w-fit h-auto object-cover rounded-full group-hover:saturate-200 transition" [src]="this.modelImageURL" (error)="updateUrlWithDefault()">
            <div class="grid grid-cols-1 gap-2 h-full justify-center content-center px-0.5">
                <ng-container *ngFor="let _ of [].constructor(5); let i = index">
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

  `})
export class SearchTileComponent implements OnInit {

    @Input() model: DishDTO;
    @Input() showDescription: Boolean = true;

    showOverlay: boolean = false;

    defaultIMG = "/assets/images/dishHldr.webp";
    imgBaseURL = "https://salver.blob.core.windows.net/dishimages/";
    modelImageURL;

    currencySymbol: string = "$"

    constructor() {}

    updateUrlWithDefault() {
        this.modelImageURL = this.defaultIMG
    }
   
    ngOnInit(): void {
        if (this.model.id == null) {
            this.modelImageURL = this.defaultIMG;
        }
        else {
            this.modelImageURL = this.imgBaseURL + this.model.id + ".webp"
        }
    }

    invertOverlayFlag() {
        this.showOverlay = !this.showOverlay;
    }

    disableLoginOverlay(eventFlag:boolean) {
        this.showOverlay = eventFlag;
    }


}
