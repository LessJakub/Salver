import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from './guards/logged-in.guard';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { TeamPageComponent } from './team-page/team-page.component';
import { FAQComponent } from './faq/faq.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RestaurantPageComponent } from './restaurant-page/restaurant-page.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { UserActivityComponent } from './user-activity/user-activity.component';

const routes: Routes = [
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'team', component: TeamPageComponent },
  { path: 'faq', component: FAQComponent },

  { path: 'search-page', component: SearchPageComponent,
    // canActivate: [LoggedInGuard]
  },
  { path: 'activity', component: UserActivityComponent,
    //canActivate: [LoggedInGuard]
  },
  { path: 'restaurant/:id', component: RestaurantPageComponent,
    //canActivate: [LoggedInGuard]
  },
  { path: '', redirectTo: '/landing-page', pathMatch: 'full'},  // default route
  { path: '**', component: PageNotFoundComponent}               // wildcard for any other path
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
