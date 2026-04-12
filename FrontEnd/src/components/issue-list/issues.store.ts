import { ActionReducerMapBuilder, createAction, createReducer } from '@reduxjs/toolkit';
import { API_ROUTES } from '../../app/constants';
import { apiService, createApiThunk } from '../../shared/api/axios';
import {
  APIRequestState,
  IAPIRequestState,
} from '../../shared/api/models';
import {
  ApiDataStateType,
  createAPIReducerCases,
} from '../../shared/store/utils';
import {
  mockCompanyPersonForAssigne,
  mockIssuePriorities,
} from './issue.data';
import {
  ICompanyPersonForAssigne,
  IIssue,
  IIssueCreateReqPayload,
  IIssueDetailsModalState,
  IIssuePriority,
  IIssueUpdateReqPayload,
} from './issue.types';
import {
  applyIssueUpdateOnList,
  getInitialIssueDetailsModalState,
  mapIssueToUpdateReqPayload,
  reconcileCreatedIssueOnList,
  setIssueDetailsModalState,
} from './issues.utils';

export interface IssuesStoreState {
  issues: IIssue[];
  issuePriorities: IIssuePriority[];
  companyPersonForAssigne: ICompanyPersonForAssigne[];
  issueDetailsModal: IIssueDetailsModalState;
  createIssueReqState: IAPIRequestState<{data: IIssue}>;
  updateIssueReqState: IAPIRequestState<{data: IIssue}>;
  priorityListRes: IAPIRequestState<{data: IIssuePriority[]}>;
  getIssuesRes: IAPIRequestState<{data: IIssue[]}>;
}

const initialState: IssuesStoreState = {
  issues: [],
  issuePriorities: mockIssuePriorities,
  companyPersonForAssigne: mockCompanyPersonForAssigne,
  issueDetailsModal: getInitialIssueDetailsModalState(),
  createIssueReqState: APIRequestState.create<{data: IIssue}>(),
  updateIssueReqState: APIRequestState.create<{data: IIssue}>(),
  priorityListRes: APIRequestState.create<{data: IIssuePriority[]}>(),
  getIssuesRes: APIRequestState.create<{data: IIssue[]}>(),
};

const createReducerKey = (subKey: string): string => {
  return 'issues/' + subKey;
};

export const getIssuesReqAction = createApiThunk(
  createReducerKey('getIssuesReqAction'),
  async () =>
    apiService.get<{data: IIssue[]}>(`${API_ROUTES.ISSUES.GET_ISSUES}`),
);

export const createIssueReqAction = createApiThunk(
  createReducerKey('createIssueReqAction'),
  async (reqPayload?: IIssueCreateReqPayload) =>
    apiService.post<{data: IIssue}>(`${API_ROUTES.ISSUES.CREATE_ISSUE}`, reqPayload),
);

export const updateIssueReqAction = createApiThunk(
  createReducerKey('updateIssueReqAction'),
  async (reqPayload?: IIssueUpdateReqPayload) =>
    apiService.patch<{data: IIssue}>(`${API_ROUTES.ISSUES.UPDATE_ISSUE}${reqPayload?.id}/`, reqPayload),
);

export const getPriorityListReqAction = createApiThunk(
  createReducerKey('getPriorityListReqAction'),
  async () =>
    apiService.get<{data: IIssuePriority[]}>(`${API_ROUTES.ISSUES.GET_PRIORITIES}`),
);

export const openCreateIssueModal = createAction(
  createReducerKey('openCreateIssueModal'),
);

export const openEditIssueModal = createAction<IIssue>(
  createReducerKey('openEditIssueModal'),
);

export const closeIssueModal = createAction(createReducerKey('closeIssueModal'));

export const createIssueOptimisticAction = createAction<IIssue>(
  createReducerKey('createIssueOptimisticAction'),
);

export const updateIssueOptimisticAction = createAction<IIssueUpdateReqPayload>(
  createReducerKey('updateIssueOptimisticAction'),
);

export const issuesReducer = createReducer(initialState, (builder) => {
  builder.addCase(openCreateIssueModal, (state) => {
    setIssueDetailsModalState(state.issueDetailsModal, 'create');
  });

  builder.addCase(openEditIssueModal, (state, action) => {
    setIssueDetailsModalState(state.issueDetailsModal, 'edit', action.payload);
  });

  builder.addCase(closeIssueModal, (state) => {
    state.issueDetailsModal.isOpen = false;
  });

  builder.addCase(createIssueOptimisticAction, (state, action) => {
    state.issues.unshift(action.payload);
  });

  builder.addCase(updateIssueOptimisticAction, (state, action) => {
    applyIssueUpdateOnList(state.issues, action.payload);

    if (state.issueDetailsModal.issue?.id === action.payload.id) {
      state.issueDetailsModal.issue = {
        ...state.issueDetailsModal.issue,
        ...action.payload,
      };
    }
  });

  createAPIReducerCases(getIssuesReqAction, 'getIssuesRes', builder, {
    onPending(state) {
      const issuesState = state as IssuesStoreState;
      issuesState.getIssuesRes.error = undefined;
    },
    onFulfilled(state, reqData) {
      const issuesState = state as IssuesStoreState;
      issuesState.issues = [...reqData.data];
    },
    onRejected() {},
  });
  createAPIReducerCases(createIssueReqAction, 'createIssueReqState', builder, {
    onPending(state) {
      const issuesState = state as IssuesStoreState;
      issuesState.createIssueReqState.error = undefined;
    },
    onFulfilled(state, reqData) {
      const issuesState = state as IssuesStoreState;
      reconcileCreatedIssueOnList(issuesState.issues, reqData.data);
    },
    onRejected() {},
  });

  createAPIReducerCases(updateIssueReqAction, 'updateIssueReqState', builder, {
    onPending(state) {
      const issuesState = state as IssuesStoreState;
      issuesState.updateIssueReqState.error = undefined;
    },
    onFulfilled(state, reqData) {
      const issuesState = state as IssuesStoreState;
      applyIssueUpdateOnList(
        issuesState.issues,
        mapIssueToUpdateReqPayload(reqData.data),
      );

      if (issuesState.issueDetailsModal.issue?.id === reqData.data.id) {
        issuesState.issueDetailsModal.issue = reqData.data;
      }
    },
    onRejected() {},
  });

    createAPIReducerCases(getPriorityListReqAction, 'priorityListRes', builder,{});
});
