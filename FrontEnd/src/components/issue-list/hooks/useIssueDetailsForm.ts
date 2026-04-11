import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import {
  closeIssueModal,
  createIssueOptimisticAction,
  createIssueReqAction,
  updateIssueOptimisticAction,
  updateIssueReqAction,
} from '../issues.store';
import {
  IIssue,
  IIssueCreateReqPayload,
  IIssueDetailsFormValues,
  IIssueUpdateReqPayload,
  IssueModalMode,
} from '../issue.types';

interface UseIssueDetailsFormControllerParams {
  mode: IssueModalMode;
  issue?: IIssue;
}

type FormFieldName = keyof IIssueDetailsFormValues;

const getNextIssueId = (issues: IIssue[]) =>
  issues.reduce((maxId, issue) => Math.max(maxId, issue.id), 0) + 1;

const getFormDefaults = (
  mode: IssueModalMode,
  issue: IIssue | undefined,
  defaultPriorityId: number,
  defaultAssigneeId: number,
): IIssueDetailsFormValues => {
  if (mode === 'edit' && issue) {
    return {
      title: issue.title,
      description: issue.description,
      location: issue.location,
      status: issue.status,
      priority: issue.priority,
      assigned: issue.assigned,
    };
  }

  return {
    title: '',
    description: '',
    location: '',
    status: 'Open',
    priority: defaultPriorityId,
    assigned: defaultAssigneeId,
  };
};

const createUpdatePayload = (
  id: number,
  field: FormFieldName,
  value: string | number,
): IIssueUpdateReqPayload => {
  const dateUpdated = new Date().toISOString();

  switch (field) {
    case 'title':
      return { id, title: value as string, date_updated: dateUpdated };
    case 'description':
      return { id, description: value as string, date_updated: dateUpdated };
    case 'location':
      return { id, location: value as string, date_updated: dateUpdated };
    case 'status':
      return { id, status: value as IIssueUpdateReqPayload['status'], date_updated: dateUpdated };
    case 'priority':
      return { id, priority: value as number, date_updated: dateUpdated };
    case 'assigned':
      return { id, assigned: value as number, date_updated: dateUpdated };
    default:
      return { id, date_updated: dateUpdated };
  }
};

export const useIssueDetailsForm = ({
  mode,
  issue,
}: UseIssueDetailsFormControllerParams) => {
  const dispatch = useAppDispatch();

  const {
    issues,
    issuePriorities,
    companyPersonForAssigne,
    createIssueReqState,
    updateIssueReqState,
  } = useAppSelector((state) => state.issuesReducer);

  const defaultPriorityId = issuePriorities[0]?.id ?? 0;
  const defaultAssigneeId = companyPersonForAssigne[0]?.id ?? 0;

  const defaultValues = useMemo(
    () => getFormDefaults(mode, issue, defaultPriorityId, defaultAssigneeId),
    [mode, issue, defaultPriorityId, defaultAssigneeId],
  );

  const latestValuesRef = useRef<IIssueDetailsFormValues>(defaultValues);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState,
  } = useForm<IIssueDetailsFormValues>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    latestValuesRef.current = defaultValues;
    reset(defaultValues);
  }, [defaultValues, reset]);

  const patchFieldIfNeeded = useCallback(
    (field: FormFieldName, value: string | number) => {
      if (mode !== 'edit' || !issue) {
        return;
      }

      if (latestValuesRef.current[field] === value) {
        return;
      }

      latestValuesRef.current = {
        ...latestValuesRef.current,
        [field]: value as never,
      };

      const payload = createUpdatePayload(issue.id, field, value);
      dispatch(updateIssueOptimisticAction(payload));
      dispatch(updateIssueReqAction(payload));
    },
    [dispatch, issue, mode],
  );

  const handleTextBlur = useCallback(
    (field: 'title' | 'description' | 'location', nextValue: string) => {
      patchFieldIfNeeded(field, nextValue);
    },
    [patchFieldIfNeeded],
  );

  const handleStatusChange = useCallback(
    (value: IIssueDetailsFormValues['status']) => {
      setValue('status', value, { shouldDirty: true, shouldValidate: true });
      patchFieldIfNeeded('status', value);
    },
    [patchFieldIfNeeded, setValue],
  );

  const handlePriorityChange = useCallback(
    (value: number) => {
      setValue('priority', value, { shouldDirty: true, shouldValidate: true });
      patchFieldIfNeeded('priority', value);
    },
    [patchFieldIfNeeded, setValue],
  );

  const handleAssignedChange = useCallback(
    (value: number) => {
      setValue('assigned', value, { shouldDirty: true, shouldValidate: true });
      patchFieldIfNeeded('assigned', value);
    },
    [patchFieldIfNeeded, setValue],
  );

  const onCreateSubmit = handleSubmit((values) => {
    if (mode !== 'create') {
      return;
    }

    const nowIsoDate = new Date().toISOString();
    const payload: IIssueCreateReqPayload = {
      title: values.title,
      description: values.description,
      location: values.location,
      status: 'Open',
      date_created: nowIsoDate,
      date_updated: nowIsoDate,
      priority: Number(values.priority),
      assigned: Number(values.assigned),
      requester: 1,
    };

    const optimisticIssue: IIssue = {
      id: getNextIssueId(issues),
      ...payload,
    };

    dispatch(createIssueOptimisticAction(optimisticIssue));
    dispatch(createIssueReqAction(payload));
    dispatch(closeIssueModal());
  });

  return {
    register,
    watch,
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
  };
};
