import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-tab-switcher',
  template: `

    <div class="w-full h-full overflow-clip items-center content-center flex">

        <div class="w-full h-full flex flex-nowrap gap-4 justify-between items-center">
            <ng-container *ngFor="let name of tabNames; index as i">
                
                <!-- Basis-0 and flex-grow makes buttons divide equally in parent container width-wise. -->    
                <button (click)="select(i)" *ngIf="(selectedID) == i" class="h-3/4 truncate basis-0 flex-grow border text-md font-medium rounded-xl bg-green-900 text-gray-50 border-green-900">
                    {{name}}
                </button>  

                <button (click)="select(i)" *ngIf="(selectedID) != i" class="h-3/4 truncate basis-0 flex-grow border text-md font-medium rounded-xl text-green-900 bg-gray-50 hover:bg-green-800 hover:text-gray-50 border-green-900">
                    {{name}}
                </button>  

            </ng-container>
        </div>

    </div>

  `})


export class TabSwitcherComponent implements OnInit {

    @Input() tabNames: string[] = ["Tab 1", "Tab 2"];
    @Input() default: number = 0;
    selectedID: number;

    @Output() tabSelectEvent = new EventEmitter<number>();

    constructor() { }

    ngOnInit(): void {
        if (this.default >= this.tabNames.length) {
            this.default = 0;
        }
        this.selectedID = this.default;
    }

    select(id: number) {
        if (id < this.tabNames.length) {
            this.selectedID = id;
            this.tabSelectEvent.emit(id);
        }
    }

}
