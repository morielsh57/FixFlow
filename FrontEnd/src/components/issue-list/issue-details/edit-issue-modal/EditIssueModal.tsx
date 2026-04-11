import { useAppDispatch, useAppSelector } from '../../../../app/store';
import { closeIssueModal } from '../../issues.store';
import IssueDetailsForm from '../issue-details-form/IssueDetailsForm';
import IssueDetailsModal from '../issue-details-modal/IssueDetailsModal';

const EditIssueModal = () => {
  const dispatch = useAppDispatch();
  const issueDetailsModal = useAppSelector(
    (state) => state.issuesReducer.issueDetailsModal,
  );

  const isOpen = issueDetailsModal.isOpen && issueDetailsModal.mode === 'edit';

  return (
    <IssueDetailsModal
      isOpen={isOpen}
      title="Issue Details"
      onClose={() => dispatch(closeIssueModal())}
      className="edit-issue-modal"
    >
      <IssueDetailsForm mode="edit" issue={issueDetailsModal.issue} />
    </IssueDetailsModal>
  );
};

export default EditIssueModal;
