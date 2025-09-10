import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = ''
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = `modal--${size}`;

  return (
    <div className="modal-root" role="dialog" aria-modal="true">
      <div className="modal-outer">
        <div
          className="modal-backdrop"
          onClick={closeOnBackdropClick ? onClose : undefined}
          aria-hidden="true"
        />

        <div className={`modal-content-wrapper ${sizeClass} ${className}`} onClick={(e) => e.stopPropagation()}>
          <div className="modal-card">
            {(title || showCloseButton) && (
              <div className="modal-header">
                {title && <h2 className="modal-title">{title}</h2>}
                {showCloseButton && (
                  <button onClick={onClose} className="modal-close" aria-label="Close modal">
                    <X className="modal-close__icon" />
                  </button>
                )}
              </div>
            )}

            <div className="modal-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
