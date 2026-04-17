import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../app/store';
import {
  closeIssueModal,
  createIssueOptimisticAction,
  createIssueReqAction,
  removeIssueOptimisticActionById,
  updateIssueOptimisticAction,
  updateIssueReqAction,
} from '../issues.store';
import {
  IIssue,
  IIssueCreateReqPayload,
  IIssueDetailsFormValues,
  IIssueOptimisticUpdatePayload,
  IIssuePriority,
  IIssueUpdateReqActionPayload,
  IssueModalMode,
} from '../issue.types';
import { IUser } from '../../../shared/store/user.types';
import { showErrorAlert } from '../../../shared/utils/alerts.utils';

interface UseIssueDetailsFormControllerParams {
  mode: IssueModalMode;
  issue?: IIssue;
}

type FormFieldName = keyof IIssueDetailsFormValues;


export const useIssueDetailsForm = ({
  mode,
  issue,
}: UseIssueDetailsFormControllerParams) => {
  const dispatch = useAppDispatch();

  const {
    issues,
    priorityListRes,
    createIssueReqState,
    updateIssueReqState,
  } = useAppSelector((state) => state.issuesReducer);
  const { userList, user } = useAppSelector((state) => state.userStoreReducer);

  const priorityList = priorityListRes.data?.data ?? [];
  const defaultPriorityId = priorityList[0]?.id ?? 1;
  const defaultAssigneeId = userList[0]?.id ?? 1;

  const defaultValues = useMemo(
    () => getFormDefaults(mode, issue, defaultPriorityId, defaultAssigneeId),
    [mode, issue, defaultPriorityId, defaultAssigneeId],
  );

  const latestValuesRef = useRef<IIssueDetailsFormValues>(defaultValues);
  const initializedIssueIdRef = useRef<number | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState,
  } = useForm<IIssueDetailsFormValues>({
    mode: 'onChange',
    defaultValues,
  });

  // reset the form data with defaultValues when the modal is opened or when the issue changes (in edit mode)
  useEffect(() => {
    if (mode === 'create') {
      latestValuesRef.current = defaultValues;
      reset(defaultValues);
      initializedIssueIdRef.current = undefined;
      return;
    }

    if (mode === 'edit' && !!issue?.id) {
      // only reset the form with issue details when the opened issue changes
      if (initializedIssueIdRef.current !== issue.id) {
        latestValuesRef.current = defaultValues;
        reset(defaultValues);
        initializedIssueIdRef.current = issue.id;
      }
    }
  }, [defaultValues, issue?.id, mode, reset]);

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
        [field]: value,
      };

      const optimisticPayload = createOptimisticUpdatePayload(
        issue.id,
        field,
        value,
        priorityList,
        userList,
      );
      const requestPayload = { [field]: value };
      const updateRequestArgs: IIssueUpdateReqActionPayload = {
        id: issue.id,
        payload: requestPayload,
      };

      dispatch(updateIssueOptimisticAction(optimisticPayload));
      void dispatch(updateIssueReqAction(updateRequestArgs))
        .unwrap()
        .catch((error) => {
          const errorMessage = (error as { message?: string })?.message;
          showErrorAlert(errorMessage);
          // TODO: revert the optimistic update by patching the field back to the original value
        });
    },
    [dispatch, issue, mode, priorityList, userList],
  );

  const handleTextBlur = useCallback(
    (field: 'title' | 'description' | 'location', nextValue: string) => {
      patchFieldIfNeeded(field, nextValue);
    },
    [patchFieldIfNeeded],
  );

  const handleStatusChange = useCallback(
    (value: IIssueDetailsFormValues['status']) => {
      patchFieldIfNeeded('status', value);
    },
    [patchFieldIfNeeded],
  );

  const handlePriorityChange = useCallback(
    (value: number) => {
      patchFieldIfNeeded('priority', value);
    },
    [patchFieldIfNeeded],
  );

  const handleAssignedChange = useCallback(
    (value: number) => {
      patchFieldIfNeeded('assigned', value);
    },
    [patchFieldIfNeeded],
  );

  const onCreateSubmit = handleSubmit((values) => {
    if (mode !== 'create' || !user?.id) {
      return;
    }

    const payload: IIssueCreateReqPayload = {
      title: values.title,
      description: values.description,
      location: values.location,
      status: 'Open',
      priority: Number(values.priority),
      assigned: Number(values.assigned),
      requester: user.id,
    };

    const selectedPriority = priorityList.find(
      (priority) => priority.id === payload.priority,
    );

    const selectedAssignee = userList.find(
      (person) => person.id === payload.assigned,
    );

    const nowIsoDate = new Date().toISOString();
    const optimisticIssue: IIssue = {
      id: getNextIssueId(issues),
      date_created: nowIsoDate,
      date_updated: nowIsoDate,
      title: payload.title,
      description: payload.description,
      location: payload.location,
      status: payload.status,
      priority: selectedPriority!,
      assigned: selectedAssignee!,
      requester: user,
    };

    dispatch(createIssueOptimisticAction(optimisticIssue));
    dispatch(createIssueReqAction(payload))
      .unwrap()
      .then(() => {
        dispatch(closeIssueModal());
      })
      .catch(() => {
        // pop the new optimisticIssue from the issues list and show error alert since creation failed
        dispatch(removeIssueOptimisticActionById(optimisticIssue.id));
        showErrorAlert("Failed to create issue. Please try again.");
      });

  });

  return {
    register,
    control,
    formState,
    priorityList,
    userList,
    onCreateSubmit,
    handleTextBlur,
    handleStatusChange,
    handlePriorityChange,
    handleAssignedChange,
    createIssueReqState,
    updateIssueReqState,
  };
};

// Hook helpers
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
      priority: issue.priority.id,
      assigned: issue.assigned.id,
    };
  }

  // default values for create mode
  return {
    title: '',
    description: '',
    location: '',
    status: 'Open',
    priority: defaultPriorityId,
    assigned: defaultAssigneeId,
  };
};

const getNextIssueId = (issues: IIssue[]) =>
  issues.reduce((maxId, issue) => Math.max(maxId, issue.id), 0) + 1;

const createOptimisticUpdatePayload = (
  id: number,
  field: FormFieldName,
  value: string | number,
  priorityList: IIssuePriority[],
  userList: IUser[],
): IIssueOptimisticUpdatePayload => {
  const dateUpdated = new Date().toISOString();

  const payload = { id, date_updated: dateUpdated } as IIssueOptimisticUpdatePayload;

  if (field === 'priority') {
    const priorityId = Number(value);
    payload.priority = priorityList.find((priority) => priority.id === priorityId)
    return payload;
  } else if (field === 'assigned') {
    const assignedId = Number(value);
    payload.assigned = userList.find((person) => person.id === assignedId)
    return payload;
  } else {
    return { ...payload, [field]: value } as IIssueOptimisticUpdatePayload;
  }
};