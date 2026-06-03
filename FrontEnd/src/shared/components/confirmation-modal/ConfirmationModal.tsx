import { createPortal } from 'react-dom';
import './ConfirmationModal.scss';

interface ConfirmationModalProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onClose?: () => void;
  confirmText?: string;
  cancelText?: string;
  shouldCloseOnclickOutside?: boolean;
}

const ConfirmationModal = ({
  title,
  description,
  onConfirm,
  onClose,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  shouldCloseOnclickOutside = true,
}: ConfirmationModalProps) => {
  if (typeof document === 'undefined') {
    return null;
  }

  const handleOverlayClick = () => {
    if (shouldCloseOnclickOutside) {
      onClose?.();
    }
  };

  return createPortal(
    <div
      className="confirmation-modal-overlay"
      role="presentation"
      onClick={handleOverlayClick}
    >
      <section
        className="confirmation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirmation-modal-title" className="confirmation-modal-title">
          {title}
        </h2>

        <p className="confirmation-modal-description">{description}</p>

        <div className="confirmation-modal-actions">
          {onClose && (
            <button
              className="confirmation-modal-cancel-button"
              type="button"
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}

          <button
            className="confirmation-modal-confirm-button"
            type="button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
};

export default ConfirmationModal;
