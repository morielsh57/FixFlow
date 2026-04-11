import './IssueDetailsForm.scss';
import AppSelect, {
  IAppSelectOption,
} from '../../../../shared/components/app-select/AppSelect';
import { useIssueDetailsForm } from '../../hooks/useIssueDetailsForm';
import { IIssue, IssueModalMode, IssueStatus } from '../../issue.types';

interface IssueDetailsFormProps {
  mode: IssueModalMode;
  issue?: IIssue;
}

const IssueDetailsForm = ({ mode, issue }: IssueDetailsFormProps) => {
  const {
    register,
    formState,
    issuePriorities,
    companyPersonForAssigne,
    onCreateSubmit,
    handleTextBlur,
    handleStatusChange,
    handlePriorityChange,
    handleAssignedChange,
    createIssueReqState,
    updateIssueReqState,
    watch,
  } = useIssueDetailsForm({
    mode,
    issue,
  });

  const titleField = register('title', {
    required: 'Title is required.',
  });

  const descriptionField = register('description', {
    required: 'Description is required.',
  });

  const locationField = register('location', {
    required: 'Location is required.',
  });

  const statusField = register('status', {
    required: 'Status is required.',
  });

  const priorityField = register('priority', {
    required: 'Priority is required.',
    valueAsNumber: true,
    min: 1,
  });

  const assignedField = register('assigned', {
    required: 'Assigned user is required.',
    valueAsNumber: true,
    min: 1,
  });

  const isCreateMode = mode === 'create';
  const createRequestError = createIssueReqState.error?.message;
  const updateRequestError = updateIssueReqState.error?.message;
  const statusValue = watch('status');
  const priorityValue = watch('priority');
  const assignedValue = watch('assigned');

  const statusOptions: IAppSelectOption[] = [
    {
      value: 'Open',
      label: 'Open',
      subtitle: 'Waiting to be handled',
    },
    {
      value: 'In Progress',
      label: 'In Progress',
      subtitle: 'Currently in work',
    },
    {
      value: 'Closed',
      label: 'Closed',
      subtitle: 'Completed and resolved',
    },
  ];

  const priorityOptions: IAppSelectOption[] = issuePriorities.map((priority) => ({
    value: priority.id,
    label: priority.title,
  }));

  const assignedOptions: IAppSelectOption[] = companyPersonForAssigne.map((person) => ({
    value: person.id,
    searchLabel: `${person.first_name} ${person.last_name} ${person.username}`,
    label: `${person.first_name} ${person.last_name}`,
    subtitle: `@${person.username}`,
  }));

  return (
    <form className="issue-details-form" onSubmit={onCreateSubmit}>
      <div className="issue-details-form-field">
        <label className="issue-details-form-label" htmlFor="issue-title">
          Title
        </label>
        <input
          id="issue-title"
          className="issue-details-form-input"
          type="text"
          {...titleField}
          onBlur={(event) => {
            titleField.onBlur(event);
            handleTextBlur('title', event.target.value);
          }}
        />
        {formState.errors.title && (
          <p className="issue-details-form-error">{formState.errors.title.message}</p>
        )}
      </div>

      <div className="issue-details-form-field">
        <label className="issue-details-form-label" htmlFor="issue-description">
          Description
        </label>
        <textarea
          id="issue-description"
          className="issue-details-form-textarea"
          rows={4}
          {...descriptionField}
          onBlur={(event) => {
            descriptionField.onBlur(event);
            handleTextBlur('description', event.target.value);
          }}
        />
        {formState.errors.description && (
          <p className="issue-details-form-error">{formState.errors.description.message}</p>
        )}
      </div>

      <div className="issue-details-form-field">
        <label className="issue-details-form-label" htmlFor="issue-location">
          Location
        </label>
        <input
          id="issue-location"
          className="issue-details-form-input"
          type="text"
          {...locationField}
          onBlur={(event) => {
            locationField.onBlur(event);
            handleTextBlur('location', event.target.value);
          }}
        />
        {formState.errors.location && (
          <p className="issue-details-form-error">{formState.errors.location.message}</p>
        )}
      </div>

      {!isCreateMode && (
        <div className="issue-details-form-field">
          <label className="issue-details-form-label" htmlFor="issue-status">
            Status
          </label>
          <AppSelect
            id="issue-status"
            value={statusValue}
            className="issue-details-form-app-select"
            options={statusOptions}
            onBlur={() =>
              statusField.onBlur({
                target: { name: statusField.name },
                type: 'blur',
              } as never)
            }
            onChange={(nextValue) => {
              handleStatusChange(nextValue as IssueStatus);
            }}
          />
        </div>
      )}

      <div className="issue-details-form-field">
        <label className="issue-details-form-label" htmlFor="issue-priority">
          Priority
        </label>
        <AppSelect
          id="issue-priority"
          value={priorityValue}
          className="issue-details-form-app-select"
          options={priorityOptions}
          onBlur={() =>
            priorityField.onBlur({
              target: { name: priorityField.name },
              type: 'blur',
            } as never)
          }
          onChange={(nextValue) => {
            handlePriorityChange(Number(nextValue));
          }}
        />
      </div>

      <div className="issue-details-form-field">
        <label className="issue-details-form-label" htmlFor="issue-assigned">
          Assigned
        </label>
        <AppSelect
          id="issue-assigned"
          value={assignedValue}
          className="issue-details-form-app-select"
          searchSelect
          onSearch={() => {}}
          placeholder="Select a person"
          options={assignedOptions}
          onBlur={() =>
            assignedField.onBlur({
              target: { name: assignedField.name },
              type: 'blur',
            } as never)
          }
          onChange={(nextValue) => {
            handleAssignedChange(Number(nextValue));
          }}
        />
      </div>

      {isCreateMode ? (
        <button
          className="issue-details-form-submit-button"
          type="submit"
          disabled={formState.isSubmitting}
        >
          Create Issue
        </button>
      ) : (
        <p className="issue-details-form-auto-save">
          Changes are saved automatically when you blur fields or change dropdowns.
        </p>
      )}

      {isCreateMode && createRequestError && (
        <p className="issue-details-form-request-error">{createRequestError}</p>
      )}

      {!isCreateMode && updateRequestError && (
        <p className="issue-details-form-request-error">{updateRequestError}</p>
      )}
    </form>
  );
};

export default IssueDetailsForm;
