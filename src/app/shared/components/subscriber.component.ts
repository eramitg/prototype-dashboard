// ng dependencies
import { Component, OnDestroy } from '@angular/core';

// npm dependencies
import { Subscription } from 'rxjs/Subscription';

@Component({
	template: ''
})
export class SubscriberComponent implements OnDestroy {
	subscriptions: Subscription[] = [];
	ngOnDestroy () {
		this.subscriptions.forEach((sub: Subscription) => {
			sub.unsubscribe();
		});
	}
}
