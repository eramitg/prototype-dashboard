// ng dependencies
import { Injectable } from '@angular/core';

// npm dependencies
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DataSet, Network } from 'vis';

// custom store
import * as appStore from '@store/app.store';
import * as blockActions from '@store/block/block.actions';
import * as blockReducer from '@store/block/block.reducer';

// custom models
import {
  EActivityType,
  EJobLevel,
  IBlock,
  IBlockContent,
  LotIdRegistry
} from '@shared/models/blocks.model';

interface INetworksServiceData {
  dataSets: {
    nodes: DataSet<any>;
    edges: DataSet<any>;
  };
  network: Network | null;
}

@Injectable()
export class NetworksService {
  private blocks$: Observable<any>;
  private startingColors: string[] = ['rgb(255, 170, 0)', 'rgb(247, 99, 151)', '#00b19d'];
  private errorColor: string = '#DF3A01';
  private startingNodes: string[] = [];
  private lotIdRegistries: any = {};
  private untrustedBots: string[] = [];
  private isDebouncing: boolean = false;
  data: INetworksServiceData = {
    dataSets: {
      nodes: new DataSet(),
      edges: new DataSet()
    },
    network: null
  };
  constructor(private store: Store<appStore.State>) {
    this.blocks$ = this.store.select('block');
    this.blocks$.subscribe((data: blockReducer.BlockState) => {
      if (!data.loading && !this.isDebouncing && data.ids.length) {
        this.isDebouncing = true;
        // for each block
        for (const id in data.entities) {
          if (data.entities.hasOwnProperty(id)) {
            const entity: IBlock = data.entities[id];
            const contentsArr = entity && entity.content;
            // get content, that contains needed network infos
            if (contentsArr instanceof Array) {
              // special type (string|IBlockContent)[] needed
              // because it's an array like ['id', { IBlockContent }]

              contentsArr.forEach((contents: Object) => {

                // FIXME: remove this when real anomaly will exists
                this.insertRandomAnomaly();

                // perform addToNetwork as a non blocking operation
                setTimeout(() => this.addToNetwork(contents as IBlockContent));
              });
            }
          }
        }
        // maximum 1 redraw by second
        setTimeout(() => {
          this.isDebouncing = false;
        }, 1000);
        // fit new network into box
        if (this.data.network && typeof this.data.network.fit === 'function') {
          console.log('fit');
          this.data.network.fit();
        }
      }
    });
    this.store.dispatch(new blockActions.LoadBlocksAction());
  }

  addToNetwork(blockContent: IBlockContent): void {
    console.log('networks.service::addToNetwork');
    const variety = this.getVariety(blockContent);
    const {
      activity,
      botID
    }: { activity: string; botID: string } = blockContent.originBot;
    const { lotId }: { lotId: string } = blockContent.content;

    if (!this.lotIdRegistries[lotId]) {
      this.lotIdRegistries[lotId] = new LotIdRegistry();
    }

    if (this.untrustedBots.includes(botID)) {
      const jobLevel: any = EJobLevel[activity as any]; // TS bug: must use "any" with enum reverse map
      this.upsertNode(botID, activity, jobLevel, this.errorColor);
    } else {
      switch (activity) {
        case EActivityType.producer:
          // add producer at level 1 and link it to variety
          this.upsertNode(botID, activity, EJobLevel.producer);
          this.manageTrustedEdge(botID, variety);
          break;
        case EActivityType.carrier:
          // add carrier at level 2 and link it from variety + register lotID
          this.lotIdRegistries[lotId].carrier = botID;
          this.upsertNode(botID, activity, EJobLevel.carrier);
          this.manageTrustedEdge(variety, botID);
          break;
        case EActivityType.warehouse:
          // add warehouse at level 3
          this.lotIdRegistries[lotId].warehouse = botID;
          this.upsertNode(botID, activity, EJobLevel.warehouse);
          // if a bot carrier own current lotID, link it
          const linkedCarrier = this.lotIdRegistries[lotId].carrier;
          this.manageTrustedEdge(linkedCarrier, botID);
          break;
        case EActivityType.shop:
          // add shop at level 4
          this.upsertNode(botID, activity, EJobLevel.shop);
          // if a bot warehouse own current lotID, link it
          const linkedWarehouse = this.lotIdRegistries[lotId].warehouse;
          this.manageTrustedEdge(linkedWarehouse, botID);
          break;
        default:
          // this.data.dataSets.nodes.remove(botID);
          break;
      }
    }
  }

  upsertNode(id: string, activity: string, level: any, color?: string): void {
    this.data.dataSets.nodes.update({
      id,
      label: activity + ' ' + id,
      level,
      shape: 'circularImage',
      image: '/assets/img/' + activity + '.png',
      color
    });
  }

  manageTrustedEdge(from: string, to: string): void {
    // console.log('network.service::manageTrustedEdge', from, to, this.untrustedBots)
    if (from) {
      if (!this.untrustedBots.includes(from) && !this.untrustedBots.includes(to)) {
        this.upsertEdge(from, to);
      } else {
        this.data.dataSets.edges.remove(from, to);
      }
    }
  }

  upsertEdge(from: string, to: string): void {
    this.data.dataSets.edges.update({
      from,
      to
    });
  }

  createNetwork(el: HTMLElement): void {
    const options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      layout: {
        hierarchical: {
          enabled: true,
          direction: 'LR'
        }
      },
      physics: {
        enabled: false
      }
    };
    this.data.network = new Network(el, this.data.dataSets, options);
  }

  insertRandomAnomaly(): void {
    if (!this.untrustedBots.length) {
      const d = Math.random().toFixed(1);
      this.untrustedBots.push('BOT' + parseFloat(d) * 10);
    }
  }

  getVariety(transaction: IBlockContent): string {
    const variety = transaction.content.variety;
    if (!this.startingNodes.includes(variety)) {
      this.insertStartingNode(variety);
    }
    return variety;
  }

  insertStartingNode(variety: string): void {
    console.log('networks.service::insertStartingNode');
    this.startingNodes.push(variety);
    const idx = this.startingNodes.length - 1;
    this.data.dataSets.nodes.add({
      id: variety,
      label: variety,
      level: EJobLevel.variety,
      color: this.startingColors[idx],
      shape: 'image',
      image: '/assets/img/' + variety + '.png'
    });
  }
}
