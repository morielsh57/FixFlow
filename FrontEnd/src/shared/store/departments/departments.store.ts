import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { createReducer } from '@reduxjs/toolkit';
import { API_ROUTES } from '../../../app/constants';
import { apiService, createApiThunk } from '../../api/axios';
import { APIRequestState, type IAPIRequestState } from '../../api/models';
import { createAPIReducerCases, type ApiDataStateType } from '../utils';
import { IGetDepartmentsResponse, IDepartment } from './departments.types';

export interface DepartmentsStoreState extends ApiDataStateType {
  getDepartmentsRequest: IAPIRequestState<IGetDepartmentsResponse>;
  departments: IDepartment[];
}

const initialState: DepartmentsStoreState = {
  getDepartmentsRequest: APIRequestState.create<IGetDepartmentsResponse>(),
  departments: [{id: 1, title: 'Default1'}, { id: 2, title: 'IT' }],
};

export const getDepartmentsThunk = createApiThunk(
  'departments/getDepartments',
  () => apiService.get<IGetDepartmentsResponse>(API_ROUTES.DEPARTMENTS),
);

export const departmentsStoreReducer = createReducer(initialState, (builder) => {

  createAPIReducerCases(getDepartmentsThunk, 'getDepartmentsRequest', builder, {
    onFulfilled: (state, payload) => {
      const departments = payload.data ?? [];
      state.departments = departments;
    },
  });
});