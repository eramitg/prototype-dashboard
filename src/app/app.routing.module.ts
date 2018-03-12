// ng dependencies
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

// npm dependencies
import { TranslateService } from '@ngx-translate/core';
import { LocalizeParser, LocalizeRouterModule, LocalizeRouterSettings } from 'localize-router';
import { LocalizeRouterHttpLoader } from 'localize-router-http-loader';

// custom components
// import { NotFoundComponent } from './not-found/not-found.component';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'cycle', pathMatch: 'full', loadChildren: '@routes/+cycle/cycle.module#CycleModule' },
  {
    path: 'dashboard',
    pathMatch: 'full',
    loadChildren: '@routes/+dashboard/dashboard.module#DashboardModule'
  },
  { path: '**', redirectTo: '/notfound' }
];

@NgModule({
  imports: [
    LocalizeRouterModule.forRoot(appRoutes, {
      parser: {
        provide: LocalizeParser,
        useFactory: (
          translate: TranslateService,
          location: Location,
          settings: LocalizeRouterSettings,
          http: HttpClient
        ) => new LocalizeRouterHttpLoader(translate, location, settings, http),
        deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient]
      }
    }),
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule, LocalizeRouterModule]
})
export class AppRoutingModule {}
