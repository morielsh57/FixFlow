import { useAppDispatch } from '../../../app/store';
import { openCreateIssueModal } from '../issues.store';

export const useIssueListController = () => {
  const dispatch = useAppDispatch();

  const openIssueCreateModal = () => {
    dispatch(openCreateIssueModal());
  };

  return {
    openIssueCreateModal,
  };
};
