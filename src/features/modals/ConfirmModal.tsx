import React from 'react';
import Modal from '../Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <p>{message}</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onClose}>No</button>
    </Modal>
  );
};

export default ConfirmModal;
