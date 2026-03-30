// Written using https://levelup.gitconnected.com/handle-api-lifecycle-with-react-axios-and-redux-toolkit-1212645a6a06

import type { ActionReducerMapBuilder, AsyncThunk, Draft } from '@reduxjs/toolkit';
import type { IAPIError, IAPIRequestState } from '../api/models';
import { EAPIStatus } from '../api/models';

/**
 * A global type that every state will extend if wanting to use the generated API reducer cases
 */
export interface ApiDataStateType {
  // eslint-disable-next-line
  [apiData: string]: IAPIRequestState | any;
}

/**
 * A function which will define all cases of an api request
 * @param thunk The thunk action to connect the cases to
 * @param dataKey The dataKey which will receive the data
 * @param builder The built in redux toolkit builder
 * @param handlers Handlers to handle pending, fulfilled and rejected
 */
export const createAPIReducerCases = <T, S = void>(
  thunk:
    | AsyncThunk<T, S, { rejectValue: IAPIError }>
    | AsyncThunk<T, unknown, { rejectValue: IAPIError }>,
  dataKey: keyof ApiDataStateType,
  builder: ActionReducerMapBuilder<ApiDataStateType>,
  handlers?: {
    onPending?: (state: Draft<ApiDataStateType>) => void;
    onFulfilled?: (state: Draft<ApiDataStateType>, payload: T) => void;
    onRejected?: (state: Draft<ApiDataStateType>, payload: IAPIError) => void;
  },
) => {
  builder
    .addCase(thunk.pending, (state) => {
      state[dataKey].status = EAPIStatus.PENDING;
      handlers?.onPending?.(state);
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state[dataKey].status = EAPIStatus.FULFILLED;
      state[dataKey].data = action.payload;
      handlers?.onFulfilled?.(state, action.payload);
    })
    .addCase(thunk.rejected, (state, action) => {
      state[dataKey].status = EAPIStatus.REJECTED;
      const error = action.payload as IAPIError;
      state[dataKey].error = error;
      handlers?.onRejected?.(state, error);
    });
};
