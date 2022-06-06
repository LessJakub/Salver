import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-grade-tile',
    template: `

    <!-- <ng-container *ngIf="!isInline; else templateInline">
      <div class="w-full h-full space-y-1">
        <p *ngIf="(significant == false)" class="text-base font-thin text-gray-900 uppercase truncate">{{this.name}}</p>
        <p *ngIf="(significant == true)" class="text-base font-thin  uppercase text-gray-900 truncate">{{this.name}}</p>
        <div class="grid grid-cols-5 gap-4 justify-center content-center">
          <ng-container *ngFor="let _ of [].constructor(this.grade); let i = index">
            <div class="w-5 h-5 bg-green-700 rounded-full drop-shadow-lg"></div>
          </ng-container>
        </div>
      </div>
    </ng-container>

    <ng-template #templateInline>
      <div class="w-full h-full flex justify-between">
        <p *ngIf="(significant == false)" class="text-base font-thin text-gray-900 uppercase truncate">{{this.name}}</p>
        <p *ngIf="(significant == true)" class="text-base font-thin  uppercase text-gray-900 truncate">{{this.name}}</p>
        <div class="grid grid-cols-5 gap-4 justify-center content-center">
          <ng-container *ngFor="let _ of [].constructor(this.grade); let i = index">
            <div class="w-4 h-4 bg-green-700 rounded-full drop-shadow-lg"></div>
          </ng-container>
        </div>
        </div>
    </ng-template> -->
    <div class="w-full h-full flex">

        <!-- Text half -->
        <div class="w-1/2 h-full">
            <p *ngIf="(significant == false)" class="text-base font-thin text-gray-900 uppercase truncate">{{this.name}}</p>
            <p *ngIf="(significant == true)" class="text-base font-thin  uppercase text-gray-900 truncate">{{this.name}}</p>
        </div>

        <!-- Dots half -->
        <div *ngIf="(this.grade) != 0" class="w-1/2 h-full flex gap-1 justify-end">
            <ng-container *ngFor="let _ of [].constructor(this.grade); let i = index">
                <div class="w-5 h-5 bg-green-700 rounded-full"></div>
            </ng-container>
        </div>

        <div *ngIf="(this.grade) == 0" class="w-1/2 h-full flex gap-1 justify-end">
            <ng-container *ngFor="let _ of [].constructor(5); let i = index">
                <div class="w-5 h-5 bg-gray-50 border border-green-700 rounded-full"></div>
            </ng-container>
        </div>

    </div>
  `
})

export class GradeTileComponent implements OnInit {

    @Input() name: string = "Default";
    @Input() grade: number = 5;
    @Input() significant: boolean = false;
    @Input() isInline: boolean = false;

    constructor() { }

    ngOnInit(): void { }

}
