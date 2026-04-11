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
  priority: number;
  assigned: number;
  requester: number;
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

export interface IIssueCreateReqPayload {
  title: string;
  description: string;
  location: string;
  status: IssueStatus;
  date_created: string;
  date_updated: string;
  priority: number;
  assigned: number;
  requester: number;
}

export interface IIssueUpdateReqPayload {
  id: number;
  title?: string;
  description?: string;
  location?: string;
  status?: IssueStatus;
  date_updated?: string;
  priority?: number;
  assigned?: number;
}

export interface IIssueDetailsFormValues {
  title: string;
  description: string;
  location: string;
  status: IssueStatus;
  priority: number;
  assigned: number;
}

export interface IIssueDetailsModalState {
  isOpen: boolean;
  mode: IssueModalMode;
  issue?: IIssue;
}
