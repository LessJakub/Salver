import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-grade-component',
  template: `

    <div class="w-full h-full space-y-1">
        <p *ngIf="(significant == false)" class="text-base font-thin text-gray-900 uppercase truncate">{{this.name}}</p>
        <p *ngIf="(significant == true)" class="text-base font-thin  uppercase text-gray-900 truncate">{{this.name}}</p>
        <div class="grid grid-cols-5 gap-4 justify-center content-center">
            <ng-container *ngFor="let _ of [].constructor(this.grade); let i = index">
                <div class="w-5 h-5 bg-green-700 rounded-full drop-shadow-lg"></div>
            </ng-container>
        </div>
    </div>

  `})
export class GradeComponentComponent implements OnInit {

    @Input() name: string = "Default";
    @Input() grade: number = 5;
    @Input() significant: boolean = false;

    constructor() { }

    ngOnInit(): void {}

}
