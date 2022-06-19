import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, Meta } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';
import { RegularUserModule } from './regular-user/regular-user.module';
import { RestaurantOwnerModule } from './restaurant-owner/restaurant-owner.module';
import { SpamBrowserComponent } from './admin/components/spam-browser/spam-browser.component';

@NgModule({
  declarations: [
    AppComponent,
    SpamBrowserComponent,
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
  bootstrap: [AppComponent],
  exports: [
    SpamBrowserComponent
  ]
})
export class AppModule { }
