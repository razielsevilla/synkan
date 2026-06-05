import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-text/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-brand-text rounded-2xl max-w-lg w-full shadow-brutal-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 font-anton text-lg text-brand-accent hover:underline">
          CLOSE
        </button>

        <h3 className="text-2xl font-anton text-brand-text mb-6">{title}</h3>

        {children}
      </div>
    </div>
  );
};
