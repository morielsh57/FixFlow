import { ReactNode, useEffect, useRef, useState } from 'react';
import './IssueDetailsModal.scss';

interface IssueDetailsModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const CLOSE_ANIMATION_DURATION_MS = 260;

const IssueDetailsModal = ({
  isOpen,
  title,
  onClose,
  children,
  className,
}: IssueDetailsModalProps) => {
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isActive, setIsActive] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const openAnimationFrameRef = useRef<number>();

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  };

  const clearOpenAnimationFrame = () => {
    if (openAnimationFrameRef.current) {
      window.cancelAnimationFrame(openAnimationFrameRef.current);
      openAnimationFrameRef.current = undefined;
    }
  };

  const runOpenAnimation = () => {
    setIsActive(false);
    openAnimationFrameRef.current = window.requestAnimationFrame(() => {
      openAnimationFrameRef.current = window.requestAnimationFrame(() => {
        setIsActive(true);
      });
    });
  };

  const openModal = () => {
    clearCloseTimer();
    setIsVisible(true);
  };

  const closeModal = () => {
    if (!isVisible) {
      return;
    }

    setIsActive(false);
    closeTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, CLOSE_ANIMATION_DURATION_MS);
  };

  // handle open/close animations
  useEffect(() => {
    if (isOpen) {
      openModal();
      if (isVisible) {
        runOpenAnimation();
      }
    } else {
      closeModal();
    }

    return () => {
      clearCloseTimer();
      clearOpenAnimationFrame();
    };
  }, [isOpen, isVisible]);

  // close on escape key press
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isVisible) {
    return null;
  }

  const overlayClasses = [
    'issue-details-modal-overlay',
    isActive ? 'issue-details-modal-overlay-open' : '',
    !isActive && !isOpen ? 'issue-details-modal-overlay-close' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const panelClasses = [
    'issue-details-modal-panel',
    isActive ? 'issue-details-modal-panel-open' : '',
    !isActive && !isOpen ? 'issue-details-modal-panel-close' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={overlayClasses} onClick={onClose}>
      <section
        className={panelClasses}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="issue-details-modal-header">
          <h2 className="issue-details-modal-title">{title}</h2>
          <button
            type="button"
            className="issue-details-modal-close-button"
            onClick={onClose}
          >
            Close
          </button>
        </header>

        <div className="issue-details-modal-content">{children}</div>
      </section>
    </div>
  );
};

export default IssueDetailsModal;
