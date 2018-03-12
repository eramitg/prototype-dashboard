import { Injectable } from '@angular/core';

// npm depencencies
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Store } from '@ngrx/store';
import PouchDB from 'pouchdb-browser';
import find from 'pouchdb-find';
PouchDB.plugin(find);

// custom models
import { IBlock } from '@shared/models/blocks.model';

// custome store
import * as appStore from '@store/app.store';
import * as blockActions from '@store/block/block.actions';

// custom values
import { environment } from '@env/environment';

// custom models
interface IBlockServiceData {
	secsSinceLast: number;
	secsSinceLastInterval: any;
	secsSinceBegin: number;
	secsSinceBeginInterval: any;
}

@Injectable()
export class BlockService {
	public dbBlocks: any = new PouchDB(environment.couchUrl + 'remoteblockchaindb');
	data: IBlockServiceData = {
		secsSinceLast: 0,
		secsSinceLastInterval: null,
		secsSinceBegin: 0,
		secsSinceBeginInterval: null
	};
	constructor (private store: Store<appStore.State>) {
		this.loadBlocks();
		this.watchBlocks();
	}

	loadBlocks (id?: string): Observable<IBlock[]> {
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		let blocks: Promise<any> = null;
		if (id && typeof id === 'string') {
				blocks = this.dbBlocks.get(id).then((doc: IBlock) => {
					return doc;
				});

		} else {
			blocks = this.dbBlocks.allDocs({include_docs: true}).then((data: any) => {
				let docs: IBlock[] = [];
				if (data.rows && data.rows.length) {
					docs = data.rows.map((item: any) => item.doc);
				}
				return docs;
			});
		}
		return fromPromise(blocks).catch((err: any) => err);
	}

	watchBlocks (): void {
		// console.log('block.service::watchBlocks');
		this.dbBlocks.changes({
			since: 'now',
			live: true,
			timeout: 60000 * 60
		}).on('change', (change: any) => {
			if (change && change.id) {
				this.store.dispatch(new blockActions.LoadBlocksAction(change.id));
				// this.store.dispatch(new blockActions.LoadBlocksSuccessAction(change.doc));
				// manage counter since last interval
				this.data.secsSinceLast = 0;
				if (this.data.secsSinceLastInterval) {
					clearInterval(this.data.secsSinceLastInterval);
				}
				this.initCounterSinceLast();
			}
		}).on('error', (err: any) => {
			console.log('db errors:', err);
		});
	}

	initCounterSinceLast (): void {
		this.data.secsSinceLastInterval = setInterval(() => {
			this.data.secsSinceLast++;
		}, 1000);
	}
}
