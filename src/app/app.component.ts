// ng dependencies
import { Component, OnInit } from '@angular/core';
import {
  Event as RouterEvent,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';

// npm dependencies
import { LocalizeRouterService } from 'localize-router';

// custom services
import { SeoService } from '@core/services/seo.service';

// custom components
import { SubscriberComponent } from '@shared/components/subscriber.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent extends SubscriberComponent implements OnInit {
  cpntData = {
    version: 'Alpha v0.1.1',
    loadingRoute: true
  };
  constructor(
    private router: Router,
    private localizeRouterService: LocalizeRouterService,
    private seoService: SeoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.seoService.initialize();
    this.subscriptions.push(
      this.router.events.subscribe((event: RouterEvent) => {
        this.navigationInterceptor(event);
      })
    );
  }

  changeLanguage(): void {
    this.localizeRouterService.changeLanguage(
      this.localizeRouterService.parser.currentLang === 'en' ? 'fr' : 'en'
    );
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.cpntData.loadingRoute = true;
    }
    if (event instanceof NavigationEnd) {
      this.cpntData.loadingRoute = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.cpntData.loadingRoute = false;
    }
    if (event instanceof NavigationError) {
      this.cpntData.loadingRoute = false;
    }
  }
}
