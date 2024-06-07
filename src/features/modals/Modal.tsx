import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.modal} onClick={handleOverlayClick}>
      <div className={styles.modalCard}>
        <div className={styles.modalContent}>
          <button className={styles.modalClose} onClick={onClose}>
            <span>&times;</span>
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
};

export default Modal;
