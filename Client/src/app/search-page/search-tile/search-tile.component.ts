import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search-tile',
  template: `

    <div class="flex w-fit h-fit justify-center items-center content-center flex-col cursor-pointer group">

        <div class="flex h-60 w-60">
            <img class="mx-auto w-fit h-auto object-cover rounded-full group-hover:drop-shadow-lg group-hover:saturate-200 transition" src={{imageURL}}>
            <div class="grid grid-cols-1 gap-2 h-full justify-center content-center px-0.5">
                <ng-container *ngFor="let _ of [].constructor(grade); let i = index">
                    <div class="w-5 h-5 bg-green-700 rounded-full group-hover:drop-shadow-lg group-hover:saturate-200 transition"></div>
                </ng-container>
            </div>
        </div>        
    
        <div class="p-2 items-center content-center justify-center text-center w-60">
            <div class="w-full justify-between flex gap-2">
                <p class="text-2xl font-bold truncate">{{name}}</p>
                <p class="text-2xl font-bold">{{price}}{{currencySymbol}}</p>
            </div>
            <p class="text-md font-normal truncate">{{description}}</p>
        </div>

    </div>

  `})
export class SearchTileComponent {

    @Input() imageURL: string;
    @Input() name: string;
    @Input() description: string;
    @Input() grade: number;
    @Input() price: number;

    currencySymbol: string = "$"

    constructor() { }


}
