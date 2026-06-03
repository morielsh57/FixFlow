import { IIssueHistoryEntry } from '../../../issue.types';
import './IssueHistory.scss';

interface IssueHistoryProps {
  history: IIssueHistoryEntry[];
}

const HISTORY_CHANGE_LINE_PATTERN =
  /^(field:)(\s*)(.*?)(,\s*)(from:?)(\s*)(.*?)(,\s*)(to:?)(\s*)(.*)$/i;

const capitalizeFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatIssueHistoryTimestamp = (timestamp: string) => {
  const timestampDate = new Date(timestamp);

  if (Number.isNaN(timestampDate.getTime())) {
    return timestamp;
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestampDate);
};

const renderIssueHistoryLine = (line: string, lineIndex: number) => {
  const lineParts = line.match(HISTORY_CHANGE_LINE_PATTERN);

  if (!lineParts) {
    return line;
  }

  const [
    ,
    fieldLabel,
    fieldSpacing,
    fieldValue,
    fromSeparator,
    fromLabel,
    fromSpacing,
    fromValue,
    toSeparator,
    toLabel,
    toSpacing,
    toValue,
  ] = lineParts;

  return (
    <span key={`history-line-${lineIndex}`}>
      <strong className="issue-history__label">
        {capitalizeFirstLetter(fieldLabel)}
      </strong>
      {fieldSpacing}
      {fieldValue}
      {fromSeparator}
      <strong className="issue-history__label">{fromLabel}</strong>
      {fromSpacing}
      {fromValue}
      {toSeparator}
      <strong className="issue-history__label">{toLabel}</strong>
      {toSpacing}
      {toValue}
    </span>
  );
};

const renderIssueHistoryText = (text: string) => {
  return text.split('\n').map((line, index, lines) => (
    <span key={`history-text-line-${index}`}>
      {renderIssueHistoryLine(line, index)}
      {index < lines.length - 1 && '\n'}
    </span>
  ));
};

const IssueHistory = ({ history }: IssueHistoryProps) => {
  return (
    <section className="issue-history" aria-labelledby="issue-history-title">
      <div className="issue-history__header">
        <h3 id="issue-history-title" className="issue-history__title">
          History
        </h3>
        {history.length > 0 && (
          <span className="issue-history__count">{history.length} updates</span>
        )}
      </div>

      {history.length > 0 ? (
        <ol className="issue-history__list">
          {history.map((historyItem, index) => (
            <li
              className="issue-history__item"
              key={`${historyItem.timestamp}-${index}`}
            >
              <span className="issue-history__marker" aria-hidden="true" />
              <div className="issue-history__card">
                <p className="issue-history__text">
                  {renderIssueHistoryText(historyItem.data)}
                </p>
                <time
                  className="issue-history__timestamp"
                  dateTime={historyItem.timestamp}
                >
                  {formatIssueHistoryTimestamp(historyItem.timestamp)}
                </time>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="issue-history__empty">No history yet.</p>
      )}
    </section>
  );
};

export default IssueHistory;
