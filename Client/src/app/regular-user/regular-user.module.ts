import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { SharedModule } from '../shared/shared.module';
import { SearchBarComponent } from './components/utilities/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { ActivityPageComponent } from './components/activity-page/activity-page.component';


@NgModule({
    declarations: [
        SearchPageComponent,
        SearchBarComponent,
        ActivityPageComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
    ]
})
export class RegularUserModule { }
