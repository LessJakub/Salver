import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { SharedModule } from '../shared/shared.module';
import { SearchBarComponent } from './components/utilities/search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { ActivityPageComponent } from './components/activity-page/activity-page.component';
import { CartComponent } from './components/cart/cart.component';
import { CartPageComponent } from './components/cart-page/cart-page.component';
import { CartFooterComponent } from './components/cart-footer/cart-footer.component';


@NgModule({
    declarations: [
        SearchPageComponent,
        SearchBarComponent,
        ActivityPageComponent,
        CartComponent,
        CartPageComponent,
        CartFooterComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
    ],
    exports: [
      CartComponent,
      CartPageComponent,
      CartFooterComponent
    ]
})
export class RegularUserModule { }
