import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SearchPageComponent } from './search-page/search-page.component';

const routes: Routes = [
  { path: 'counter', component: CounterComponent },
  { path: 'fetch-data', component: FetchDataComponent },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'search-page', component: SearchPageComponent },
  { path: '', redirectTo: '/landing-page', pathMatch: 'full'},  // default route
  { path: '**', component: PageNotFoundComponent}               // wildcard for any other path
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
