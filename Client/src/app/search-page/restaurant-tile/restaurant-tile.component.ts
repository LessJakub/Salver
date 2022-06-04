import { Component, Input } from '@angular/core';
import { Dish } from 'src/app/models/Dish';
import { Restaurant } from 'src/app/models/restaurant';

@Component({
    selector: 'app-restaurant-tile',
    template: `
  
      <div class="flex w-fit h-fit justify-center items-center content-center flex-col cursor-pointer group">
  
          <div class="flex h-60 w-60">
              <img class="mx-auto w-fit h-auto object-cover rounded-full group-hover:drop-shadow-lg group-hover:saturate-200 transition" src="/assets/images/restaurant.png">
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
  
      </div>
  
    `})
export class RestaurantTileComponent {

    constructor() { }

    @Input() model: Restaurant;
    @Input() showDescription: Boolean = true;

}
