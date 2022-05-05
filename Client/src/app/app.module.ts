import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule, Meta } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginOverlayComponent } from './overlays/login-overlay/login-overlay.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { SearchTileComponent } from './search-page/search-tile/search-tile.component';
import { SearchBarComponent } from './search-page/search-bar/search-bar.component';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { DishOverlayComponent } from './overlays/dish-overlay/dish-overlay.component';
import { GradeComponentComponent } from './overlays/dish-overlay/grade-component/grade-component.component';
import { ReviewPostComponent } from './overlays/dish-overlay/review-post/review-post.component';
import { TabSwitcherComponent } from './utilities/tab-switcher/tab-switcher.component';
import { PostComponent } from './elements/post/post.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LandingPageComponent,
    FooterComponent,
    PageNotFoundComponent,
    LoginOverlayComponent,
    SearchPageComponent,
    SearchTileComponent,
    SearchBarComponent,
    UserActivityComponent,
    DishOverlayComponent,
    GradeComponentComponent,
    ReviewPostComponent,
    TabSwitcherComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [Meta],
  bootstrap: [AppComponent]
})
export class AppModule { }
