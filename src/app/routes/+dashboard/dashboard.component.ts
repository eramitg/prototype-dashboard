// ng dependencies
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

// custom services
import { BlockService } from '@store/block/block.service';
import { ChartsService } from './charts.service';

// custom components
import { SubscriberComponent } from '@shared/components/subscriber.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent extends SubscriberComponent implements OnDestroy, OnInit {
  @ViewChild('botName') botName: ElementRef;
  cpntData: any = {
    areaChart: null,
    hBarChart: null
  };
  constructor(public blockService: BlockService, public chartsService: ChartsService) {
    super();
  }

  get transactionRatio(): string {
    const secSinceBegin = this.blockService.data.secsSinceBegin;
    return (secSinceBegin
      ? this.chartsService.data.transactions.length / secSinceBegin
      : 0
    ).toFixed(2);
  }

  ngOnInit(): void {
    // alias for chart data
    this.cpntData.areaChart = this.chartsService.data.areaChart;
    this.cpntData.hBarChart = this.chartsService.data.hBarChart;
  }

  changeBotRatioVisible(): void {
    this.chartsService.selectNextBot();
    this.botName.nativeElement.style.color = this.chartsService.getCurrentBotColor();
    this.chartsService.rebuildAreaChart();
  }
}
