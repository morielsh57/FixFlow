import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import './IssueCard.scss';
import { openEditIssueModal } from './issues.store';
import { IIssue } from './issue.types';

interface Props {
  issue: IIssue;
}

const IssueCard = ({ issue }: Props) => {
  const dispatch = useAppDispatch();
  const { companyPersonForAssigne, issuePriorities } = useAppSelector(
    (state) => state.issuesReducer,
  );

  const assigneeLabel = useMemo(() => {
    const assignee = companyPersonForAssigne.find(
      (person) => person.id === issue.assigned,
    );

    if (!assignee) {
      return 'Unknown user';
    }

    return `${assignee.first_name} ${assignee.last_name} (${assignee.username})`;
  }, [companyPersonForAssigne, issue.assigned]);

  const priorityLabel = useMemo(() => {
    const priority = issuePriorities.find((item) => item.id === issue.priority);
    return priority?.title ?? `P-${issue.priority}`;
  }, [issue.priority, issuePriorities]);

  const onOpenIssueDetails = () => {
    dispatch(openEditIssueModal(issue));
  };

  return (
    <article className="issue-card" onClick={onOpenIssueDetails}>
      <div className="issue-card__top">
        <h2 className="issue-card__title">{issue.title}</h2>
        <span
          className={`issue-card__status issue-card__status--${issue.status
            .toLowerCase()
            .replace(/\s+/g, '-')}`}
        >
          {issue.status}
        </span>
      </div>

      <p className="issue-card__description">{issue.description}</p>

      <div className="issue-card__footer">
        <span className="issue-card__label">Assignee:</span>
        <span className="issue-card__assignee">{assigneeLabel}</span>
      </div>

      <div className="issue-card__footer">
        <span className="issue-card__label">Location:</span>
        <span className="issue-card__assignee">{issue.location}</span>
      </div>

      <div className="issue-card__footer">
        <span className="issue-card__label">Priority:</span>
        <span className="issue-card__assignee">{priorityLabel}</span>
      </div>
    </article>
  );
};

export default IssueCard;
