import { Controller } from 'react-hook-form';
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
    control,
    formState,
    priorityList,
    departments,
    usersFromSelectedDepartment,
    shouldShowAssignedField,
    onCreateSubmit,
    handleTextBlur,
    handleStatusChange,
    handleDepartmentChange,
    handlePriorityChange,
    handleAssignedChange,
    createIssueReqState,
    updateIssueReqState,
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

  const isCreateMode = mode === 'create';
  const createRequestError = createIssueReqState.error?.message;
  const updateRequestError = updateIssueReqState.error?.message;

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

  const priorityOptions: IAppSelectOption[] = priorityList.map((priority) => ({
    value: priority.id,
    label: priority.title,
  }));

  const departmentOptions: IAppSelectOption[] = departments.map((department) => ({
    value: department.id,
    label: department.title,
    searchLabel: department.title,
  }));

  const assignedOptions: IAppSelectOption[] = usersFromSelectedDepartment.map((person) => ({
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
          <Controller
            name="status"
            control={control}
            rules={{ required: 'Status is required.' }}
            render={({ field }) => (
              <AppSelect
                id="issue-status"
                value={field.value}
                className="issue-details-form-app-select"
                options={statusOptions}
                onBlur={field.onBlur}
                onChange={(nextValue) => {
                  const normalizedValue = nextValue as IssueStatus;
                  field.onChange(normalizedValue);
                  handleStatusChange(normalizedValue);
                }}
              />
            )}
          />
        </div>
      )}

      <div className="issue-details-form-field">
        <label className="issue-details-form-label" htmlFor="issue-department">
          Department
        </label>
        <Controller
          name="department"
          control={control}
          rules={{
            required: 'Department is required.',
          }}
          render={({ field }) => (
            <AppSelect
              id="issue-department"
              value={field.value}
              className="issue-details-form-app-select"
              searchSelect
              onSearch={() => {}}
              placeholder="Select a department"
              options={departmentOptions}
              onBlur={field.onBlur}
              onChange={(nextValue) => {
                const normalizedValue = Number(nextValue);
                field.onChange(normalizedValue);
                handleDepartmentChange(normalizedValue);
              }}
            />
          )}
        />
        {formState.errors.department && (
          <p className="issue-details-form-error">{formState.errors.department.message}</p>
        )}
      </div>

      <div className="issue-details-form-field">
        <label className="issue-details-form-label" htmlFor="issue-priority">
          Priority
        </label>
        <Controller
          name="priority"
          control={control}
          rules={{
            required: 'Priority is required.',
          }}
          render={({ field }) => (
              <AppSelect
                id="issue-priority"
                value={field.value}
                className="issue-details-form-app-select"
                options={priorityOptions}
                onBlur={field.onBlur}
              onChange={(nextValue) => {
                field.onChange(Number(nextValue));
                handlePriorityChange(Number(nextValue));
              }}
            />
          )}
        />
      </div>

      {shouldShowAssignedField && (
        <div className="issue-details-form-field">
          <label className="issue-details-form-label" htmlFor="issue-assigned">
            Assigned (Optional)
          </label>
          <Controller
            name="assigned"
            control={control}
            render={({ field }) => (
              <AppSelect
                id="issue-assigned"
                value={field.value}
                className="issue-details-form-app-select"
                searchSelect
                onSearch={() => {}}
                placeholder="Select a person"
                options={assignedOptions}
                onBlur={field.onBlur}
                onChange={(nextValue) => {
                  const normalizedValue = Number(nextValue);
                  field.onChange(normalizedValue);
                  handleAssignedChange(normalizedValue);
                }}
              />
            )}
          />
        </div>
      )}

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
