// ng dependencies
import { Component, OnInit } from '@angular/core';

// custom services
// import { BlockService } from '@store/block/block.service';
import { ChartsService } from './../charts.service';

// custom components
import { SubscriberComponent } from '@shared/components/subscriber.component';

// custom models
import { IBlock } from '@shared/models/blocks.model';

interface ILiveTransactionData {
  transactions: IBlock[];
  expandedId: number;
  timeOnConnect: number;
}

@Component({
  selector: 'app-live-transactions',
  templateUrl: './live-transactions.component.html'
})
export class LiveTransactionsComponent extends SubscriberComponent implements OnInit {
  cpntData: ILiveTransactionData = {
    transactions: null,
    expandedId: -1,
    timeOnConnect: Date.now()
  };
  constructor(/* private blockService: BlockService, */ public chartsService: ChartsService) {
    super();
  }

  ngOnInit(): void {}
  expandBlock(blockID: number): void {
    this.cpntData.expandedId = this.cpntData.expandedId === blockID ? -1 : blockID;
  }
}
