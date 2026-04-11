export type IssueStatus = 'Open' | 'In Progress' | 'Closed';

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  assignee: string;
}