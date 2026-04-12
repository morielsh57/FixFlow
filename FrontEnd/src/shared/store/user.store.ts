import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { createReducer } from '@reduxjs/toolkit';
import { API_ROUTES } from '../../app/constants';
import { apiService, createApiThunk } from '../api/axios';
import { APIRequestState, type IAPIRequestState } from '../api/models';
import { createAPIReducerCases, type ApiDataStateType } from './utils';
import { IGetUserByIdResponse, IGetUsersResponse, IUser } from './user.types';

export interface UserStoreState extends ApiDataStateType {
  getUsersRequest: IAPIRequestState<IGetUsersResponse>;
  getUserByIdRequest: IAPIRequestState<IGetUserByIdResponse>;
  userList: IUser[];
  user?: IUser;
}

const initialState: UserStoreState = {
  getUsersRequest: APIRequestState.create<IGetUsersResponse>(),
  getUserByIdRequest: APIRequestState.create<IGetUserByIdResponse>(),
  userList: [],
  user: undefined,
};

export const getUserById = createApiThunk(
  'user/userById',
  (params?: {id?: number}) => apiService.get<IGetUserByIdResponse>(`${API_ROUTES.USERS}${params?.id}/`),
);

export const getUsersThunk = createApiThunk(
  'user/getUsers',
  () => apiService.get<IGetUsersResponse>(API_ROUTES.USERS),
);

export const userStoreReducer = createReducer(initialState, (builder) => {
  const apiBuilder = builder as unknown as ActionReducerMapBuilder<ApiDataStateType>;

  createAPIReducerCases(getUsersThunk, 'getUsersRequest', apiBuilder, {
    onFulfilled: (state, payload) => {
      const users = payload.data ?? [];
      state.userList = users;
    },
  });

  createAPIReducerCases(getUserById, 'getUserByIdRequest', apiBuilder, {
    onFulfilled: (state, payload) => {
      const user = payload.data ?? {};
      state.user = user;
    },
  });
});
