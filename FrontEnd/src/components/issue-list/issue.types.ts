import { IUser } from '../../shared/store/user.types';

export type IssueStatus = 'Open' | 'In Progress' | 'Closed';

export type IssueModalMode = 'create' | 'edit';

export interface IIssue {
  id: number;
  title: string;
  description: string;
  location: string;
  status: IssueStatus;
  date_created: string;
  date_updated: string;
  priority: IIssuePriority;
  assigned: IUser;
  requester: IUser;
}

export interface IIssuePriority {
  id: number;
  title: string;
}

export interface ICompanyPersonForAssigne {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface IIssueCreateReqPayloadWithoutRequester {
  title: string;
  description: string;
  location: string;
  status: IssueStatus;
  priority: number;
  assigned: number;
}
export interface IIssueCreateReqPayload extends IIssueCreateReqPayloadWithoutRequester {
  requester: number;
}

export interface IIssueUpdateReqPayload extends Partial<IIssueCreateReqPayloadWithoutRequester> {}

export interface IIssueDetailsFormValues extends IIssueCreateReqPayloadWithoutRequester {}

export interface IIssueUpdateReqActionPayload {
  id: number;
  payload: IIssueUpdateReqPayload;
}
export interface IIssueOptimisticUpdatePayload extends Partial<IIssue> {
  id: number;
}

export interface IIssueDetailsModalState {
  isOpen: boolean;
  mode: IssueModalMode;
  issue?: IIssue;
}

export interface IIssueCreateReqServerPayload {
  data: IIssue;
}

export interface IIssueUpdateReqServerPayload {
  data: IIssue;
}