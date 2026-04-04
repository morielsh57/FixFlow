import './IssueCard.scss';
import { Issue } from './issue.types';

interface Props {
  issue: Issue;
}

const IssueCard = ({ issue }: Props) => {
  return (
    <article className="issue-card">
      <div className="issue-card__top">
        <h2 className="issue-card__title">{issue.title}</h2>
        <span className={`issue-card__status issue-card__status--${issue.status.toLowerCase().replace(/\s+/g, '-')}`}>
          {issue.status}
        </span>
      </div>

      <p className="issue-card__description">{issue.description}</p>

      <div className="issue-card__footer">
        <span className="issue-card__label">Assignee:</span>
        <span className="issue-card__assignee">{issue.assignee}</span>
      </div>
    </article>
  );
};

export default IssueCard;