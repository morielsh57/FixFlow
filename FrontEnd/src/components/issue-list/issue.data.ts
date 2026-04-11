import { Issue } from './issue.types';

export const mockIssues: Issue[] = [
  {
    id: 1,
    title: 'Login page bug',
    description: 'Users cannot log in with valid credentials in some cases.',
    status: 'Open',
    assignee: 'Emma',
  },
  {
    id: 2,
    title: 'Mobile layout overlap',
    description: 'Buttons overlap on smaller screens in the issue details page.',
    status: 'In Progress',
    assignee: 'Emma',
  },
  {
    id: 3,
    title: 'Dashboard performance lag',
    description: 'Dashboard takes too long to load when a large amount of data is returned.',
    status: 'Closed',
    assignee: 'Emma',
  },
  {
    id: 4,
    title: 'Header alignment',
    description: 'Header title is not aligned correctly on Firefox.',
    status: 'Open',
    assignee: 'Alice',
  },
];