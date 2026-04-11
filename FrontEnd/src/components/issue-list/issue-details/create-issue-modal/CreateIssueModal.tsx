import { useAppDispatch, useAppSelector } from '../../../../app/store';
import { closeIssueModal } from '../../issues.store';
import IssueDetailsForm from '../issue-details-form/IssueDetailsForm';
import IssueDetailsModal from '../issue-details-modal/IssueDetailsModal';

const CreateIssueModal = () => {
  const dispatch = useAppDispatch();
  const issueDetailsModal = useAppSelector(
    (state) => state.issuesReducer.issueDetailsModal,
  );

  const isOpen =
    issueDetailsModal.isOpen && issueDetailsModal.mode === 'create';

  return (
    <IssueDetailsModal
      isOpen={isOpen}
      title="Create New Issue"
      onClose={() => dispatch(closeIssueModal())}
      className="create-issue-modal"
    >
      <IssueDetailsForm mode="create" />
    </IssueDetailsModal>
  );
};

export default CreateIssueModal;
