import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { HttpErrorResponse } from '@angular/common/http';
import { BlockService } from './block.service';
import * as blockActions from './block.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

// custom models
import { IBlock } from '@shared/models/blocks.model';

@Injectable()
export class BlockEffects {
	@Effect() loadBlocks$: Observable<any>;

	constructor (private blockService: BlockService, private actions$: Actions) {
		this.loadBlocks$ = this.actions$
			.ofType(blockActions.LOAD_BLOCKS)
			.switchMap((state: blockActions.LoadBlocksAction) => this.blockService.loadBlocks(state.payload)
				// If successful, dispatch success action with result
				.map((res: IBlock[]) => new blockActions.LoadBlocksSuccessAction(res))
				// If request fails, dispatch failed action
				.catch((err: HttpErrorResponse) => Observable.of(new blockActions.LoadBlocksFailAction(err)))
			);
	}

}
