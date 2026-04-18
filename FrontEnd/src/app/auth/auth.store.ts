import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { createAction, createReducer } from '@reduxjs/toolkit';
import { API_ROUTES, AUTH_LOCAL_STORAGE_KEYS } from '../constants';
import { apiService, createApiThunk } from '../../shared/api/axios';
import { APIRequestState, type IAPIRequestState } from '../../shared/api/models';
import { createAPIReducerCases, type ApiDataStateType } from '../../shared/store/utils';
import { setItemInLocalStorage } from '../../shared/utils/localStorage.utils';
import { LoginRequest, LoginResponse, SignupRequest } from './auth.types';

export interface AuthStoreState extends ApiDataStateType {
  signupRes: IAPIRequestState<void>;
  loginRes: IAPIRequestState<LoginResponse>;
  signupLoginPayload?: LoginRequest;
}

const initialState: AuthStoreState = {
  signupRes: APIRequestState.create<void>(),
  loginRes: APIRequestState.create<LoginResponse>(),
  signupLoginPayload: undefined,
};

export const setSignupLoginPayload = createAction<LoginRequest>('auth/setSignupLoginPayload');

export const signupRequest = createApiThunk<void, SignupRequest>(
  'auth/signup',
  (payload) => apiService.post<void>(API_ROUTES.AUTH.SIGNUP, payload),
);

export const loginRequest = createApiThunk<LoginResponse, LoginRequest>(
  'auth/login',
  (payload) => apiService.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, payload),
);

export const authStoreReducer = createReducer(initialState, (builder) => {
  const apiBuilder = builder as unknown as ActionReducerMapBuilder<ApiDataStateType>;

  builder.addCase(setSignupLoginPayload, (state, action) => {
    state.signupLoginPayload = action.payload;
  });

  createAPIReducerCases(signupRequest, 'signupRes', apiBuilder);
  createAPIReducerCases(loginRequest, 'loginRes', apiBuilder, {
    onFulfilled: (_, payload) => {
      setItemInLocalStorage(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN, payload.access);
      setItemInLocalStorage(AUTH_LOCAL_STORAGE_KEYS.REFRESH_TOKEN, payload.refresh);
    },
  });
});
