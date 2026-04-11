import { useMemo } from 'react';
import { useAppSelector } from '../../app/store';
import './IssueList.scss';
import CreateIssueModal from './issue-details/create-issue-modal/CreateIssueModal';
import EditIssueModal from './issue-details/edit-issue-modal/EditIssueModal';
import IssueCard from './IssueCard';
import { useIssueListController } from './hooks/useIssueListController';

const LOGGED_IN_USERNAME = 'emma';

const IssueList = () => {
  const { openIssueCreateModal } = useIssueListController();
  const { issues, companyPersonForAssigne } = useAppSelector(
    (state) => state.issuesReducer,
  );

  const loggedInPerson = useMemo(
    () =>
      companyPersonForAssigne.find(
        (person) => person.username.toLowerCase() === LOGGED_IN_USERNAME,
      ),
    [companyPersonForAssigne],
  );

  const userIssues = useMemo(() => {
    if (!loggedInPerson) {
      return issues;
    }

    return issues.filter((issue) => issue.assigned === loggedInPerson.id);
  }, [issues, loggedInPerson]);

  const openIssues = useMemo(() => {
    return userIssues.filter(
      (issue) => issue.status === 'Open' || issue.status === 'In Progress'
    );
  }, [userIssues]);

  const closedIssues = useMemo(() => {
    return userIssues.filter((issue) => issue.status === 'Closed');
  }, [userIssues]);

  return (
    <div className="issue-list-page">
      <div className="issue-list-page__header">
        <div>
          <h1 className="issue-list-page__title">My Issues</h1>
          <p className="issue-list-page__subtitle">
            Logged in as {loggedInPerson?.first_name ?? 'User'}
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