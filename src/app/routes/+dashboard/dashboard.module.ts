// ng dependencies
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// npm dependencies
import { LocalizeRouterModule } from 'localize-router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// custom modules
import { SharedModule } from '@shared/shared.module';

// custom services
import { ChartsService } from './charts.service';

// custom components
import { DashboardComponent } from './dashboard.component';
import { LiveTransactionsComponent } from './live-transactions/live-transactions.component';

const routes = [{ path: '',  component: DashboardComponent, pathMatch: 'full' }];

@NgModule({
	imports: [
		CommonModule,
		NgxChartsModule,
		SharedModule,
		RouterModule.forChild(routes),
		LocalizeRouterModule.forChild(routes)
	],
	providers: [
		ChartsService
	],
	declarations: [DashboardComponent, LiveTransactionsComponent],
	exports: []
})
export class DashboardModule { }
