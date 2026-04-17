import {
  IIssue,
  IIssueDetailsModalState,
  IIssueOptimisticUpdatePayload,
  IssueModalMode,
} from './issue.types';

export const getInitialIssueDetailsModalState = (): IIssueDetailsModalState => {
  return {
    isOpen: false,
    mode: 'create',
    issue: undefined,
  };
};

export const setIssueDetailsModalState = (
  modalState: IIssueDetailsModalState,
  mode: IssueModalMode,
  issue?: IIssue,
): void => {
  modalState.isOpen = true;
  modalState.mode = mode;
  modalState.issue = issue;
};

export const applyIssueUpdateOnList = (
  issues: IIssue[],
  patch: IIssueOptimisticUpdatePayload,
): void => {
  const issueIndex = issues.findIndex((issue) => issue.id === patch.id);

  if (issueIndex < 0) {
    return;
  }

  const issue = issues[issueIndex];

  issues[issueIndex] = {
    ...issue,
    ...patch,
    date_updated: patch.date_updated ?? issue.date_updated,
  };
};

export const reconcileCreatedIssueOnList = (
  issues: IIssue[],
  serverIssue: IIssue,
): void => {
  const issueIndexById = issues.findIndex((issue) => issue.id === serverIssue.id);

  if (issueIndexById >= 0) {
    issues[issueIndexById] = serverIssue;
    return;
  }

  const issueIndexBySignature = issues.findIndex(
    (issue) =>
      issue.title === serverIssue.title &&
      issue.description === serverIssue.description &&
      issue.location === serverIssue.location &&
      issue.requester.id === serverIssue.requester.id,
  );

  if (issueIndexBySignature >= 0) {
    issues[issueIndexBySignature] = serverIssue;
    return;
  }

  issues.unshift(serverIssue);
};

