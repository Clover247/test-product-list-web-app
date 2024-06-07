import React from 'react';
import Modal from './Modal';
import styles from './Modal.module.scss';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.confirmModal}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonContainer}>
          <button className={`${styles.button} ${styles.confirmButton}`} onClick={onConfirm}>Yes</button>
          <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>No</button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
