import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './components/overview/overview.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        OverviewComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
    ]
})
export class RestaurantOwnerModule { }
