import { useAppDispatch, useAppSelector } from '../../app/store';
import './IssueCard.scss';
import { openEditIssueModal } from './issues.store';
import { IIssue } from './issue.types';

interface Props {
  issue: IIssue;
}

const IssueCard = ({ issue }: Props) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.userStoreReducer);

  const isAssignedToMe = Boolean(user?.id && issue.assigned?.id === user.id);
  const assigneeLabel = !issue.assigned
    ? 'Unassigned'
    : isAssignedToMe
      ? 'Assigned to me'
      : `${issue.assigned.first_name} ${issue.assigned.last_name}`;
  const reporterLabel = `${issue.requester.first_name} ${issue.requester.last_name}`;
  const priorityLabel = issue.priority.title;

  const onOpenIssueDetails = () => {
    dispatch(openEditIssueModal(issue));
  };

  return (
    <article className="issue-card" onClick={onOpenIssueDetails}>
      <div className="issue-card__top">
        <h2 className="issue-card__title" title={issue.title}>
          {issue.title}
        </h2>
        <span
          className={`issue-card__status issue-card__status--${issue.status
            .toLowerCase()
            .replace(/\s+/g, '-')}`}
        >
          {issue.status}
        </span>
      </div>

      <p className="issue-card__description" title={issue.description}>
        {issue.description}
      </p>

      <div className="issue-card__labels">
        <span className="issue-card__chip">
          <span className="issue-card__label">Assignee:</span>
          <span
            className={`issue-card__assignee ${isAssignedToMe ? 'issue-card__assignee--me' : ''}`}
          >
            {assigneeLabel}
          </span>
        </span>

        <span className="issue-card__chip">
          <span className="issue-card__label">Reporter:</span>
          <span className="issue-card__assignee">{reporterLabel}</span>
        </span>

        <span className="issue-card__chip">
          <span className="issue-card__label">Location:</span>
          <span className="issue-card__assignee">{issue.location}</span>
        </span>

        <span className="issue-card__chip">
          <span className="issue-card__label">Priority:</span>
          <span className="issue-card__assignee">{priorityLabel}</span>
        </span>
      </div>
    </article>
  );
};

export default IssueCard;
