import { Component, OnInit, Input } from '@angular/core';
import { UploadService } from 'src/app/services/upload.service';
import { RestaurantDTO } from 'src/app/shared/models/RestaurantDTO';

@Component({
    selector: 'app-restaurant-tile',
    template: `
  
      <a [routerLink]="['/restaurant/', model.id]" class="flex w-fit h-fit justify-center items-center content-center flex-col cursor-pointer group">
  
          <div class="flex h-60 w-60">
              <img class="mx-auto w-fit h-auto object-cover rounded-full group-hover:drop-shadow-lg group-hover:saturate-200 transition" [src]="this.modelImageURL" (error)="updateUrlWithDefault()">
              <div class="grid grid-cols-1 gap-2 h-full justify-center content-center px-0.5">
                  <ng-container *ngFor="let _ of [].constructor(5); let i = index">
                      <div class="w-5 h-5 bg-green-700 rounded-full group-hover:drop-shadow-lg group-hover:saturate-200 transition"></div>
                  </ng-container>
              </div>
          </div>        
      
          <div *ngIf="showDescription == true" class="p-2 items-center content-center justify-center text-center w-60">
              <div class="w-full justify-between flex">
                  <p class="text-2xl font-bold truncate">{{model.name}}</p>
                  <!-- <p class="text-2xl font-bold">{{model.price}}{{currencySymbol}}</p> -->
              </div>
              <p class="text-md font-normal truncate">{{model.description}}</p>
          </div>
        </a>
  `,
})
export class RestaurantTileComponent implements OnInit {

    modelImageURL: string;

    updateUrlWithDefault() {
        this.modelImageURL = this.uploadService.defaultRestaurantImageURL();
    }

    constructor(private uploadService: UploadService) { }

    ngOnInit(): void {
        this.modelImageURL = this.uploadService.restaurantImageURL(this.model.id);
    }

    @Input() model: RestaurantDTO;
    @Input() showDescription: Boolean = true;


}
