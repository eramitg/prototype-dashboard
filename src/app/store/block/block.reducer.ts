import * as block from './block.actions';
// import { HttpErrorResponse } from '@angular/common/http';

import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector } from '@ngrx/store';

// custom models
import { IBlock } from '@shared/models/blocks.model';

export const blockAdapter: EntityAdapter<IBlock> = createEntityAdapter<IBlock>({
  selectId: (currentBlock: IBlock) => currentBlock.blockID
});
// tslint:disable-next-line:no-empty-interface
export interface BlockState extends EntityState<IBlock> {
  loading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  liveOnly: any[];
  last: any;
}

export const defaultBlockState: any = {
  ids: [],
  entities: {},
  loading: false,
  liveOnly: [],
  errorMessage: null,
  successMessage: null,
  last: null
};

export const initialBlockState: BlockState = blockAdapter.getInitialState(defaultBlockState);

export function reducer(state = initialBlockState, action: block.Actions): BlockState {
  switch (action.type) {
    case block.LOAD_BLOCKS:
      return {
        ...state,
        loading: true
      };

    case block.LOAD_BLOCKS_SUCCESS:
      const blocks: any = (action as any).payload;
      return {
        ...(blocks instanceof Array
          ? blockAdapter.addAll(blocks, state)
          : blockAdapter.addOne(blocks, state)),
        loading: false,
        successMessage: 'Loading of Block has been successful!',
        liveOnly:
          !(blocks instanceof Array) &&
          !state.liveOnly.find((b: IBlock) => b.blockID === blocks.blockID)
            ? [...state.liveOnly, blocks]
            : state.liveOnly,
        last: blocks instanceof Array ? state.last : blocks
      };

    case block.LOAD_BLOCKS_FAIL:
      return {
        ...state,
        loading: false,
        errorMessage: (action as any).error
      };

    default: {
      return state;
    }
  }
}

export const getBlockState = createFeatureSelector<BlockState>('block');

export const { selectIds, selectEntities, selectAll, selectTotal } = blockAdapter.getSelectors(
  getBlockState
);
