import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { createReducer } from '@reduxjs/toolkit';
import { API_ROUTES, AUTH_LOCAL_STORAGE_KEYS } from '../constants';
import { apiService, createApiThunk } from '../../shared/api/axios';
import { APIRequestState, type IAPIRequestState } from '../../shared/api/models';
import { createAPIReducerCases, type ApiDataStateType } from '../../shared/store/utils';
import { setItemInLocalStorage } from '../../shared/utils/localStorage.utils';
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from './auth.types';

export interface AuthStoreState extends ApiDataStateType {
  signupRes: IAPIRequestState<SignupResponse>;
  loginRes: IAPIRequestState<LoginResponse>;
}

const initialState: AuthStoreState = {
  signupRes: APIRequestState.create<SignupResponse>(),
  loginRes: APIRequestState.create<LoginResponse>(),
};

export const signupRequest = createApiThunk<SignupResponse, SignupRequest>(
  'auth/signup',
  (payload) => apiService.post<SignupResponse>(API_ROUTES.AUTH.SIGNUP, payload),
);

export const loginRequest = createApiThunk<LoginResponse, LoginRequest>(
  'auth/login',
  (payload) => apiService.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, payload),
);

export const authStoreReducer = createReducer(initialState, (builder) => {
  const apiBuilder = builder as unknown as ActionReducerMapBuilder<ApiDataStateType>;

  createAPIReducerCases(signupRequest, 'signupRes', apiBuilder);
  createAPIReducerCases(loginRequest, 'loginRes', apiBuilder, {
    onFulfilled: (_, payload) => {
      setItemInLocalStorage(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN, payload.access);
      setItemInLocalStorage(AUTH_LOCAL_STORAGE_KEYS.REFRESH_TOKEN, payload.refresh);
    },
  });
});
