import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, Meta } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostComponent } from './elements/post/post.component';

import { SharedModule } from './shared/shared.module';
import { RegularUserModule } from './regular-user/regular-user.module';
import { RestaurantOwnerModule } from './restaurant-owner/restaurant-owner.module';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    RegularUserModule,
    RestaurantOwnerModule,
  ],
  providers: [Meta],
  bootstrap: [AppComponent]
})
export class AppModule { }
