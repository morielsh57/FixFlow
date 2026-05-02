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
  IIssueUpdateReqPayload,
  IIssueOptimisticUpdatePayload,
  IIssuePriority,
  IIssueUpdateReqActionPayload,
  IssueModalMode,
} from '../issue.types';
import { IDepartment } from '../../../shared/store/departments/departments.types';
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
  const { departments } = useAppSelector((state) => state.departmentsStoreReducer);

  const priorityList = priorityListRes.data?.data ?? [];
  const defaultPriorityId = priorityList[0]?.id ?? 1;
  const defaultDepartmentId = user?.department?.id ?? departments[0]?.id ?? 1;

  const defaultValues = useMemo(
    () => getFormDefaults(mode, issue, defaultPriorityId, defaultDepartmentId),
    [mode, issue, defaultPriorityId, defaultDepartmentId],
  );

  const latestValuesRef = useRef<IIssueDetailsFormValues>(defaultValues);
  const initializedIssueIdRef = useRef<number | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState,
  } = useForm<IIssueDetailsFormValues>({
    mode: 'onChange',
    defaultValues,
  });
  const selectedDepartmentId = watch('department');
  const loggedinUserDepartmentId = user?.department?.id;
  const shouldShowAssignedField = Boolean(
    user?.is_manager &&
    loggedinUserDepartmentId &&
    Number(selectedDepartmentId) === loggedinUserDepartmentId,
  );

  const usersFromSelectedDepartment = useMemo(() => {
    if (!selectedDepartmentId) {
      return [];
    }

    return userList.filter((person) => person.department?.id === Number(selectedDepartmentId));
  }, [selectedDepartmentId, userList]);

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
        departments,
      );
      const requestPayload = { [field]: value } as IIssueUpdateReqPayload;
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
    [departments, dispatch, issue, mode, priorityList, userList],
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

  const handleDepartmentChange = useCallback(
    (value: number) => {
      patchFieldIfNeeded('department', value);
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
      department: Number(values.department),
      priority: Number(values.priority),
      requester: user.id,
    };

    if (values.assigned !== undefined && values.assigned !== null) {
      payload.assigned = Number(values.assigned);
    }

    const selectedPriority = priorityList.find(
      (priority) => priority.id === payload.priority,
    );

    const selectedAssignee = userList.find(
      (person) => person.id === payload.assigned,
    );

    const selectedDepartment = departments.find(
      (department) => department.id === payload.department,
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
      assigned: selectedAssignee ?? null,
      requester: user,
      department: selectedDepartment!,
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
  };
};

// Hook helpers
const getFormDefaults = (
  mode: IssueModalMode,
  issue: IIssue | undefined,
  defaultPriorityId: number,
  defaultDepartmentId: number,
): IIssueDetailsFormValues => {
  if (mode === 'edit' && issue) {
    return {
      title: issue.title,
      description: issue.description,
      location: issue.location,
      status: issue.status,
      department: issue.department?.id ?? defaultDepartmentId,
      priority: issue.priority.id,
      assigned: issue.assigned?.id,
    };
  }

  // default values for create mode
  return {
    title: '',
    description: '',
    location: '',
    status: 'Open',
    department: defaultDepartmentId,
    priority: defaultPriorityId,
    assigned: undefined,
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
  departments: IDepartment[],
): IIssueOptimisticUpdatePayload => {
  const dateUpdated = new Date().toISOString();

  const payload = { id, date_updated: dateUpdated } as IIssueOptimisticUpdatePayload;

  if (field === 'priority') {
    const priorityId = Number(value);
    payload.priority = priorityList.find((priority) => priority.id === priorityId)
    return payload;
  } else if (field === 'department') {
    const departmentId = Number(value);
    payload.department = departments.find((department) => department.id === departmentId);
    return payload;
  } else if (field === 'assigned') {
    const assignedId = Number(value);
    payload.assigned = userList.find((person) => person.id === assignedId)
    return payload;
  } else {
    return { ...payload, [field]: value } as IIssueOptimisticUpdatePayload;
  }
};
