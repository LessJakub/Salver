import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { RestaurantTileComponent } from './components/utilities/restaurant-tile/restaurant-tile.component';
import { DishTileComponent } from './components/utilities/dish-tile/dish-tile.component';
import { DishOverlayComponent } from './components/overlays/dish-overlay/dish-overlay.component';
import { GradeTileComponent } from './components/utilities/grade-tile/grade-tile.component';
import { ReviewPostComponent } from './components/posts/review-post/review-post.component';
import { TabSwitcherComponent } from './components/utilities/tab-switcher/tab-switcher.component';


@NgModule({
  declarations: [
    ErrorPageComponent,
    DishTileComponent,
    RestaurantTileComponent,
    DishOverlayComponent,
    GradeTileComponent,
    ReviewPostComponent,
    TabSwitcherComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports: [
    RestaurantTileComponent,
    DishTileComponent,
    GradeTileComponent,
    ReviewPostComponent,
    TabSwitcherComponent,
  ]
})
export class SharedModule { }
