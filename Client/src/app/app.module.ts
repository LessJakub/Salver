import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, Meta } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LoginOverlayComponent } from './overlays/login-overlay/login-overlay.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { SearchBarComponent } from './search-page/search-bar/search-bar.component';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { PostComponent } from './elements/post/post.component';
import { RestaurantPageComponent } from './restaurant-page/restaurant-page.component';
import { MenuPostComponent } from './elements/menu-post/menu-post.component';
import { TeamPageComponent } from './team-page/team-page.component';

import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LoginOverlayComponent,
    SearchPageComponent,
    SearchBarComponent,
    UserActivityComponent,
    PostComponent,
    RestaurantPageComponent,
    MenuPostComponent,
    TeamPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [Meta],
  bootstrap: [AppComponent]
})
export class AppModule { }
