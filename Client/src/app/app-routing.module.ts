import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from './guards/logged-in.guard';

import { TeamPageComponent } from './team-page/team-page.component';
import { RestaurantPageComponent } from './restaurant-page/restaurant-page.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { OverviewComponent } from './restaurant-owner/components/overview/overview.component';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';

import { FaqPageComponent } from './shared/components/faq-page/faq-page.component';
import { LandingPageComponent } from './shared/components/landing-page/landing-page.component';
import { DebugUploadPageComponent } from './shared/components/debug-upload-page/debug-upload-page.component';

const routes: Routes = [
  { path: 'landing-page', component: LandingPageComponent },

  { path: 'overview', component: OverviewComponent},
  { path: 'team', component: TeamPageComponent },
  { path: 'faq', component: FaqPageComponent },

  { path: 'upload', component: DebugUploadPageComponent,
    canActivate: [LoggedInGuard] 
  },

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
  { path: '**', component: ErrorPageComponent}               // wildcard for any other path
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
