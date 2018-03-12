// ng dependencies
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// npm dependencies
import { TranslateModule } from '@ngx-translate/core';
import { LocalizeRouterModule } from 'localize-router';

// custom components
import { SubscriberComponent } from '@shared/components/subscriber.component';

// custom pipes

@NgModule({
	imports: [
		CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, LocalizeRouterModule,
		RouterModule
	],
	declarations: [SubscriberComponent],
	providers: [],
	exports: [
		CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, LocalizeRouterModule,
		RouterModule
	]
})
export class SharedModule { }
