import {
  ICompanyPersonForAssigne,
  IIssue,
  IIssuePriority,
} from './issue.types';

export const mockIssuePriorities: IIssuePriority[] = [
  { id: 1, title: 'Low' },
  { id: 2, title: 'Medium' },
  { id: 3, title: 'High' },
  { id: 4, title: 'Critical' },
];

export const mockCompanyPersonForAssigne: ICompanyPersonForAssigne[] = [
  { id: 1, username: 'emma', first_name: 'Emma', last_name: 'Smith' },
  { id: 2, username: 'alice', first_name: 'Alice', last_name: 'Brown' },
  { id: 3, username: 'david', first_name: 'David', last_name: 'Miller' },
  { id: 4, username: 'lea', first_name: 'Lea', last_name: 'Taylor' },
];

export const mockIssues: IIssue[] = [
  {
    id: 1,
    title: 'Login page bug',
    description: 'Users cannot log in with valid credentials in some cases.',
    location: 'Auth module',
    status: 'Open',
    date_created: '2026-03-30T08:15:00.000Z',
    date_updated: '2026-04-08T09:30:00.000Z',
    priority: 3,
    assigned: 1,
    requester: 1,
  },
  {
    id: 2,
    title: 'Mobile layout overlap',
    description: 'Buttons overlap on smaller screens in the issue details page.',
    location: 'Issue details page',
    status: 'In Progress',
    date_created: '2026-03-25T10:20:00.000Z',
    date_updated: '2026-04-09T14:15:00.000Z',
    priority: 2,
    assigned: 1,
    requester: 1,
  },
  {
    id: 3,
    title: 'Dashboard performance lag',
    description: 'Dashboard takes too long to load when large data is returned.',
    location: 'Dashboard',
    status: 'Closed',
    date_created: '2026-03-15T11:00:00.000Z',
    date_updated: '2026-04-01T16:40:00.000Z',
    priority: 4,
    assigned: 1,
    requester: 1,
  },
  {
    id: 4,
    title: 'Header alignment',
    description: 'Header title is not aligned correctly on Firefox.',
    location: 'Main layout',
    status: 'Open',
    date_created: '2026-03-28T09:45:00.000Z',
    date_updated: '2026-04-07T13:10:00.000Z',
    priority: 1,
    assigned: 2,
    requester: 1,
  },
];
