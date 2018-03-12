// ng dependencies
import { Injectable } from '@angular/core';

// npm dependencies
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

// custom values
import { ALL_RECORD, BOT_COUNTS, BOT_RECORDS } from './dashboard.value';
import { IBotSeriesItem } from './dashboard.model';

// custom services
import { BlockService } from '@store/block/block.service';

// custom store
import * as appStore from '@store/app.store';
import * as blockReducer from '@store/block/block.reducer';

// custom models
import { IBlock } from '@shared/models/blocks.model';

interface IChartsServiceData {
  areaChart: any;
  hBarChart: any;
  transactions: IBlock[];
}

@Injectable()
export class ChartsService {
  private blocks$: Observable<any>;
  data: IChartsServiceData = {
    areaChart: {
      ratioTick: 5,
      colorScheme: {
        domain: ['#3bafda']
      },
      botRecords: BOT_RECORDS,
      botRatioVisible: 1,
      allRecord: ALL_RECORD,
      botRatios: []
    },
    hBarChart: {
      colorScheme: {
        domain: null
      },
      showYAxis: true,
      botCounts: BOT_COUNTS,
      loaded: true // remove after issue closed (https://github.com/swimlane/ngx-charts/issues/498)
    },
    transactions: []
  };

  constructor(private blockService: BlockService, private store: Store<appStore.State>) {
    // init time interval for charts
    this.initCounterSinceBegin();

    this.setHBarColorScheme();

    // wait for new transations
    this.blocks$ = this.store.select('block');
    this.blocks$.subscribe((state: blockReducer.BlockState) => {
      const authorizedBots = ['BOT1', 'BOT2', 'BOT3', 'BOT4'];
      this.data.transactions = state.liveOnly;
      if (state.last && state.last.creator && authorizedBots.includes(state.last.creator)) {
        this.data.hBarChart.loaded = false;
        this.incrementBotCount(state.last.creator);
        // remove when ngx-charts issue fixed (https://github.com/swimlane/ngx-charts/issues/498))
        // not closed in 7.0.1 (10/01/2018)
        setTimeout(() => {
          this.data.hBarChart.loaded = true;
        });
      }
    });
  }

  setHBarColorScheme(): void {
    this.data.hBarChart.colorScheme.domain = this.data.hBarChart.botCounts.map((botCount: any) => {
      return botCount.scheme;
    });
  }

  rebuildAreaChart(): void {
    const areaChart = this.data.areaChart;
    // console.log('charts.service::rebuildAreaChart');
    areaChart.botRatios = [
      areaChart.allRecord,
      areaChart.botRecords[areaChart.botRatioVisible - 1]
    ];
    areaChart.colorScheme.domain[1] = areaChart.botRecords[areaChart.botRatioVisible - 1].scheme;
  }

  selectNextBot(): void {
    if (this.data.areaChart.botRatioVisible < this.data.areaChart.botRecords.length) {
      this.data.areaChart.botRatioVisible++;
    } else {
      this.data.areaChart.botRatioVisible = 1;
    }
  }

  getCurrentBotColor(): any {
    return this.data.areaChart.botRecords[this.data.areaChart.botRatioVisible - 1].scheme;
  }

  incrementBotCount(botName: string): void {
    const botCounts = this.data.hBarChart.botCounts;
    const bot = botCounts.find((currentBot: any) => currentBot.name === botName);
    if (bot) {
      bot.value++;
      this.data.hBarChart.botCounts = botCounts.slice();
    }
    this.reorderBotCounts();
  }

  reorderBotCounts(): void {
    const botCounts = this.data.hBarChart.botCounts;
    botCounts.sort((a: IBotSeriesItem, b: IBotSeriesItem) => a.value - b.value).reverse();
    this.setHBarColorScheme();
  }

  initCounterSinceBegin(): void {
    this.rebuildAreaChart();
    this.blockService.data.secsSinceBeginInterval = setInterval(() => {
      this.blockService.data.secsSinceBegin++;
      let ratioTick = this.data.areaChart.ratioTick;
      const isMaxSimpleTick = this.blockService.data.secsSinceBegin > ratioTick * 100;
      ratioTick = isMaxSimpleTick ? ratioTick * 10 : ratioTick;
      if (this.blockService.data.secsSinceBegin % ratioTick === 0) {
        this.data.areaChart.allRecord.series.push({
          name: this.blockService.data.secsSinceBegin + 's',
          value: 100
        });
        this.data.areaChart.botRecords.forEach((records: any, idx: number) => {
          records.series.push({
            name: this.blockService.data.secsSinceBegin + 's',
            value: this.getBotRatio(idx)
          });
        });
        this.rebuildAreaChart();
      }
    }, 1000);
  }

  getBotRatio(num: number): number {
    const transactions = this.data.transactions;
    const count = transactions.reduce((total, x) => {
      return x.creator === 'BOT' + (num + 1) ? total + 1 : total;
    }, 0);
    return transactions.length + count > 0 ? Math.round(100 / (transactions.length / count)) : 0;
  }
}
