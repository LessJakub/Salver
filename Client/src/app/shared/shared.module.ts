import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { RestaurantTileComponent } from './components/utilities/restaurant-tile/restaurant-tile.component';
import { DishTileComponent } from './components/utilities/dish-tile/dish-tile.component';
import { DishOverlayComponent } from './components/overlays/dish-overlay/dish-overlay.component';
import { GradeTileComponent } from './components/utilities/grade-tile/grade-tile.component';
import { ReviewPostComponent } from './components/posts/review-post/review-post.component';
import { TabSwitcherComponent } from './components/utilities/tab-switcher/tab-switcher.component';
import { FaqPageComponent } from './components/faq-page/faq-page.component';
import { DebugUploadPageComponent } from './components/debug-upload-page/debug-upload-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LoginOverlayComponent } from './components/overlays/login-overlay/login-overlay.component';
import { TeamPageComponent } from './components/team-page/team-page.component';
import { MenuPostComponent } from './components/posts/menu-post/menu-post.component';
import { RestaurantPageComponent } from './components/restaurant-page/restaurant-page.component';
import { ActivityPostComponent } from './components/posts/activity-post/activity-post.component';
import { NewMealOverlayComponent } from './components/overlays/new-meal-overlay/new-meal-overlay.component';
import { AddDishPostComponent } from './components/posts/add-dish-post/add-dish-post.component';
import { DeleteDishOverlayComponent } from './components/overlays/delete-dish-overlay/delete-dish-overlay.component';


@NgModule({
    declarations: [
        ErrorPageComponent,
        DishTileComponent,
        RestaurantTileComponent,
        DishOverlayComponent,
        GradeTileComponent,
        ReviewPostComponent,
        TabSwitcherComponent,
        FaqPageComponent,
        DebugUploadPageComponent,
        FooterComponent,
        LandingPageComponent,
        NavBarComponent,
        LoginOverlayComponent,
        TeamPageComponent,
        MenuPostComponent,
        RestaurantPageComponent,
        ActivityPostComponent,
        NewMealOverlayComponent,
        AddDishPostComponent,
        DeleteDishOverlayComponent,
    ],
    imports: [
        CommonModule,
        SharedRoutingModule,
        FormsModule,
    ],
    exports: [
        RestaurantTileComponent,
        DishTileComponent,
        GradeTileComponent,
        ReviewPostComponent,
        TabSwitcherComponent,
        DebugUploadPageComponent,
        FooterComponent,
        LandingPageComponent,
        NavBarComponent,
        LoginOverlayComponent,
        MenuPostComponent,
        RestaurantPageComponent,
        ActivityPostComponent,
        AddDishPostComponent,
        DeleteDishOverlayComponent,
    ]
})
export class SharedModule { }
