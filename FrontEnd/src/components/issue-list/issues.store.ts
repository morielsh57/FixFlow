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
  mockIssues,
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
  createIssueReqState: IAPIRequestState<IIssue>;
  updateIssueReqState: IAPIRequestState<IIssue>;
}

const initialState: IssuesStoreState = {
  issues: mockIssues,
  issuePriorities: mockIssuePriorities,
  companyPersonForAssigne: mockCompanyPersonForAssigne,
  issueDetailsModal: getInitialIssueDetailsModalState(),
  createIssueReqState: APIRequestState.create<IIssue>(),
  updateIssueReqState: APIRequestState.create<IIssue>(),
};

const createReducerKey = (subKey: string): string => {
  return 'issues/' + subKey;
};

export const createIssueReqAction = createApiThunk<IIssue, IIssueCreateReqPayload>(
  createReducerKey('createIssueReqAction'),
  async (reqPayload?: IIssueCreateReqPayload) =>
    apiService.post<IIssue>(`${API_ROUTES.ISSUES.CREATE_ISSUE}`, reqPayload),
);

export const updateIssueReqAction = createApiThunk<IIssue, IIssueUpdateReqPayload>(
  createReducerKey('updateIssueReqAction'),
  async (reqPayload?: IIssueUpdateReqPayload) =>
    apiService.patch<IIssue>(`${API_ROUTES.ISSUES.UPDATE_ISSUE}`, reqPayload),
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

  createAPIReducerCases(createIssueReqAction, 'createIssueReqState', builder, {
    onPending(state) {
      const issuesState = state as IssuesStoreState;
      issuesState.createIssueReqState.error = undefined;
    },
    onFulfilled(state, reqData) {
      const issuesState = state as IssuesStoreState;
      reconcileCreatedIssueOnList(issuesState.issues, reqData);
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
        mapIssueToUpdateReqPayload(reqData),
      );

      if (issuesState.issueDetailsModal.issue?.id === reqData.id) {
        issuesState.issueDetailsModal.issue = reqData;
      }
    },
    onRejected() {},
  });
});
