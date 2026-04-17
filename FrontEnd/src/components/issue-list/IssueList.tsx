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
      (issue) => issue.assigned.id === user.id || issue.requester.id === user.id,
    );
  }, [issues, user]);

  const openIssues = useMemo(() => {
    return userIssues.filter((issue) => issue.status.toLowerCase() !== 'closed');
  }, [userIssues]);

  const closedIssues = useMemo(() => {
    return userIssues.filter((issue) => issue.status.toLowerCase() === 'closed');
  }, [userIssues]);

  const userName = () => {
    if (user?.first_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user?.username) {
      return user.username;
    }

    return 'User';
  };

  return (
    <div className="issue-list-page">
      <div className="issue-list-page__header">
        <div>
          <h1 className="issue-list-page__title">My Issues</h1>
          <p className="issue-list-page__subtitle">
            Logged in as {userName()}
          </p>
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
            <span className="issue-list-page__summary-number">{openIssues.length}</span>
            <span className="issue-list-page__summary-label">Open</span>
          </div>

          <div className="issue-list-page__summary-box">
            <span className="issue-list-page__summary-number">{closedIssues.length}</span>
            <span className="issue-list-page__summary-label">Closed</span>
          </div>
        </div>
      </div>

      <section className="issue-section">
        <div className="issue-section__header">
          <h2 className="issue-section__title">Open Issues</h2>
        </div>

        <div className="issue-section__list">
          {openIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>

      <section className="issue-section">
        <div className="issue-section__header">
          <h2 className="issue-section__title">Closed Issues</h2>
        </div>

        <div className="issue-section__list">
          {closedIssues.map((issue) => (
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
