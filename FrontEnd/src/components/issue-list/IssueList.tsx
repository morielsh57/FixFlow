import { useEffect, useMemo, useState } from 'react';
import './IssueList.scss';
import IssueCard from './IssueCard';
import { mockIssues } from './issue.data';
import { Issue } from './issue.types';

const IssueList = () => {
  const [issues, setIssues] = useState<Issue[]>([]);

  // replace this later with the real logged-in username from auth/store
  const loggedInUsername = 'Emma';

  const fetchIssues = async () => {
    // later replace with real API call
    setIssues(mockIssues);
  };

  useEffect(() => {
    fetchIssues();

    const intervalId = setInterval(() => {
      fetchIssues();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const userIssues = useMemo(() => {
    return issues.filter((issue) => issue.assignee === loggedInUsername);
  }, [issues, loggedInUsername]);

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
            Logged in as {loggedInUsername}
          </p>
        </div>

        <div className="issue-list-page__summary">
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
    </div>
  );
};

export default IssueList;