import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import './IssueList.scss';
import CreateIssueModal from './issue-details/create-issue-modal/CreateIssueModal';
import EditIssueModal from './issue-details/edit-issue-modal/EditIssueModal';
import IssueCard from './IssueCard';
import { useIssueListController } from './hooks/useIssueListController';
import { getIssuesReqAction, getPriorityListReqAction } from './issues.store';

const IssueList = () => {
  const { openIssueCreateModal } = useIssueListController();
  const { issues } = useAppSelector(
    (state) => state.issuesReducer,
  );
  const { user } = useAppSelector(
    (state) => state.userStoreReducer,
  );
  const dispatch = useAppDispatch();


  useEffect(() => {
    dispatch(getIssuesReqAction());
    dispatch(getPriorityListReqAction());
  }, [dispatch]);

  const userIssues = useMemo(() => {
    if (!user) {
      return [];
    }

    return issues.filter(
      (issue) => issue.assigned?.id === user.id || issue.requester.id === user.id,
    );
  }, [issues, user]);

  const isManager = Boolean(user?.is_manager);
  const userDepartmentId = user?.department?.id;

  const unassignedDepartmentIssues = useMemo(() => {
    if (!isManager || !userDepartmentId) {
      return [];
    }
    return issues.filter((issue) => {
      const isSameDepartment = issue.department?.id === userDepartmentId;
      const isUnassigned = !issue.assigned;
      const isNotClosed = issue.status.toLowerCase() !== 'closed';
      return isSameDepartment && isUnassigned && isNotClosed;
    });
  }, [isManager, issues, userDepartmentId]);

  const openedAssignedDepartmentIssues = useMemo(() => {
    if (!isManager || !userDepartmentId) {
      return [];
    }
    return issues.filter((issue) => {
      const isSameDepartment = issue.department?.id === userDepartmentId;
      const isNotAssignedToMe = !!issue.assigned && issue.assigned.id !== user.id;
      const isNotClosed = issue.status.toLowerCase() !== 'closed';
      return isSameDepartment && isNotAssignedToMe && isNotClosed;
    });
  }, [isManager, issues, userDepartmentId, user?.id]);

  const closedAssignedDepartmentIssues = useMemo(() => {
    if (!isManager || !userDepartmentId) {
      return [];
    }
    return issues.filter((issue) => {
      const isSameDepartment = issue.department?.id === userDepartmentId;
      const isNotAssignedToMe = !!issue.assigned && issue.assigned.id !== user.id;
      const isClosed = issue.status.toLowerCase() === 'closed';
      return isSameDepartment && isNotAssignedToMe && isClosed;
    });
  }, [isManager, issues, userDepartmentId, user?.id]);

  const openIssues = useMemo(() => {
    return userIssues.filter((issue) => issue.status.toLowerCase() !== 'closed');
  }, [userIssues]);

  const closedIssues = useMemo(() => {
    return userIssues.filter((issue) => issue.status.toLowerCase() === 'closed');
  }, [userIssues]);

  const totalOpenedIssues = openIssues.length + openedAssignedDepartmentIssues.length + unassignedDepartmentIssues.length;
  const totalClosedIssues = closedIssues.length + closedAssignedDepartmentIssues.length;

  return (
    <div className="issue-list-page">
      <div className="issue-list-page__header">
        <div>
          <h1 className="issue-list-page__title">My Issues</h1>
        </div>

        <div className="issue-list-page__summary">
          <button
            type="button"
            className="issue-list-page__create-button"
            onClick={openIssueCreateModal}
          >
            Create Issue
          </button>

          <div className="issue-list-page__summary-box">
            <span className="issue-list-page__summary-number">{totalOpenedIssues}</span>
            <span className="issue-list-page__summary-label">Open</span>
          </div>

          <div className="issue-list-page__summary-box">
            <span className="issue-list-page__summary-number">{totalClosedIssues}</span>
            <span className="issue-list-page__summary-label">Closed</span>
          </div>
        </div>
      </div>

      {isManager && (
        <section className="issue-section">
          <div className="issue-section__header">
            <h2 className="issue-section__title">Unassigned Department Issues</h2>
          </div>
          <div className="issue-section__list">
            {unassignedDepartmentIssues.length > 0 ? (
              unassignedDepartmentIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))
            ) : (
              <p className="issue-section__empty">No unassigned issues in your department.</p>
            )}
          </div>
        </section>
      )}

      <section className="issue-section">
        <div className="issue-section__header">
          <h2 className="issue-section__title">Open Issues</h2>
        </div>

        <div className="issue-section__list">
          {[...openedAssignedDepartmentIssues, ...openIssues].map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>

      <section className="issue-section">
        <div className="issue-section__header">
          <h2 className="issue-section__title">Closed Issues</h2>
        </div>

        <div className="issue-section__list">
          {[...closedAssignedDepartmentIssues, ...closedIssues].map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>

      <CreateIssueModal />
      <EditIssueModal />
    </div>
  );
};

export default IssueList;
