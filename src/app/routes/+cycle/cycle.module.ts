// ng dependencies
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// npm dependencies
import { LocalizeRouterModule } from 'localize-router';

// custom modules
import { SharedModule } from '@shared/shared.module';

// custom services
import { NetworksService } from './networks.service';

// custom components
import { CycleComponent } from './cycle.component';

const routes = [{ path: '', component: CycleComponent, pathMatch: 'full' }];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(routes)
  ],
  providers: [NetworksService],
  declarations: [CycleComponent],
  exports: []
})
export class CycleModule {}
