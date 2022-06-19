import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-grade-tile',
    template: `

    <div *ngIf="this.enableGrading == false" class="w-full h-full flex">

        <!-- Text half -->
        <div class="w-1/2 h-full">
            <p *ngIf="(significant == false)" class="text-base font-thin text-gray-900 uppercase truncate">{{this.name}}</p>
            <p *ngIf="(significant == true)" class="text-base font-thin  uppercase text-gray-900 truncate">{{this.name}}</p>
        </div>

        <!-- Dots half -->
        <div class="w-1/2 h-full flex gap-1 justify-end">
            <ng-container *ngFor="let _ of [].constructor(this.grade); let i = index">
                <div (click)="this.selectGrade(i + 1)" class="w-5 h-5 aspect-square bg-green-700 rounded-full group-hover:saturate-200 transition"></div>
            </ng-container>

            <ng-container *ngFor="let _ of [].constructor(5 - this.grade); let i = index">
                <div (click)="this.selectGrade(this.activeGrade + i + 1)" class="w-5 h-5 aspect-square border border-green-700 rounded-full group-hover:saturate-200 transition"></div>
            </ng-container>
        </div>
        
        <!-- <div *ngIf="(this.grade) != 0" class="w-1/2 h-full flex gap-1 justify-end">
            <ng-container *ngFor="let _ of [].constructor(this.grade); let i = index">
                <div class="w-5 h-5 bg-green-700 rounded-full"></div>
            </ng-container>
        </div>

        <div *ngIf="(this.grade) == 0" class="w-1/2 h-full flex gap-1 justify-end">
            <ng-container *ngFor="let _ of [].constructor(5); let i = index">
                <div class="w-5 h-5 bg-gray-50 border border-green-700 rounded-full"></div>
            </ng-container>
        </div> -->

    </div>


    <div *ngIf="this.enableGrading == true" class="w-full h-fit flex">

        <!-- Text half -->
        <div class="w-1/2 h-full">
            <p class="text-base font-thin text-gray-900 uppercase truncate">{{this.name}}</p>
        </div>

        <!-- Default when created -->
        <div *ngIf="(this.activeGrade) == 0" class="w-1/2 h-full flex gap-1 justify-end">
            <ng-container *ngFor="let _ of [].constructor(5); let i = index">
                <div (click)="this.selectGrade(i + 1)" class="w-5 h-5 aspect-square cursor-pointer border border-red-700 rounded-full group-hover:saturate-200 transition"></div>
            </ng-container>
        </div>

        <!-- If any grade is selected -->
        <div *ngIf="(this.activeGrade) != 0" class="w-1/2 h-full flex gap-1 justify-end overflow-clip">
            <ng-container *ngFor="let _ of [].constructor(this.activeGrade); let i = index">
                <div (click)="this.selectGrade(i + 1)" class="w-5 h-5 aspect-square bg-green-700 cursor-pointer rounded-full group-hover:saturate-200 transition"></div>
            </ng-container>

            <ng-container *ngFor="let _ of [].constructor(5 - this.activeGrade); let i = index">
                <div (click)="this.selectGrade(this.activeGrade + i + 1)" class="w-5 h-5 aspect-square border border-green-700 cursor-pointer rounded-full group-hover:saturate-200 transition"></div>
            </ng-container>
        </div>
    </div>
  `
})

export class GradeTileComponent implements OnInit {

    @Input() name: string = "Default";
    @Input() grade: number = 5;
    @Input() significant: boolean = false;
    @Input() enableGrading: boolean = false;


    constructor() { }

    ngOnInit(): void {
        this.grade = Math.round(this.grade);
        if (this.grade >= 0 && this.grade <= 5) {
            this.activeGrade = this.grade;
        }
        else {
            this.activeGrade = 0;
        }
    }

    // Grading enabled
    activeGrade: number = 0;
    @Output() choiceEmitter = new EventEmitter();

    selectGrade(id: number) {
        if (id != null && id != 0) {
            this.activeGrade = id;
            console.log("Grade: " + this.name + "| Value: " + this.activeGrade);
            var choice = {
                name: this.name,
                value: this.activeGrade,
            }
            this.choiceEmitter.emit(choice);
        }
    }

}
