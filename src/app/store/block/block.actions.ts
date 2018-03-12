import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Generate constants based on the given name
 * e.g export const LOAD_USERS = '[Auth] Load USERS'
 */

export const LOAD_BLOCKS =                 '[Block] Load Blocks';
export const LOAD_BLOCKS_SUCCESS =         '[Block] Load Blocks Success';
export const LOAD_BLOCKS_FAIL =            '[Block] Load Blocks Fail';

/**
 * Load Blocks Actions
 * e.g LoadAuthAction
 */
export class LoadBlocksAction implements Action {
	readonly type: string = LOAD_BLOCKS;

	constructor (public payload?: any) { }
}

export class LoadBlocksSuccessAction implements Action {
	readonly type: string = LOAD_BLOCKS_SUCCESS;

	constructor (public payload: any) { }
}

export class LoadBlocksFailAction implements Action {
	readonly type: string = LOAD_BLOCKS_FAIL;

	constructor (public error: HttpErrorResponse) { }
}

export type Actions = LoadBlocksAction | LoadBlocksSuccessAction | LoadBlocksFailAction;
