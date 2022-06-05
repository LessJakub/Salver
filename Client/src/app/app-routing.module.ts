import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from './guards/logged-in.guard';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { TeamPageComponent } from './team-page/team-page.component';
import { FAQComponent } from './faq/faq.component';
import { RestaurantPageComponent } from './restaurant-page/restaurant-page.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { OverviewComponent } from './restaurant-owner/components/overview/overview.component';
import { ErrorPageComponent } from './shared/components/error-page/error-page.component';

const routes: Routes = [
  { path: 'landing-page', component: LandingPageComponent },

  { path: 'overview', component: OverviewComponent},
  { path: 'team', component: TeamPageComponent },
  { path: 'faq', component: FAQComponent },

  { path: 'upload', component: FileUploadComponent },

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
