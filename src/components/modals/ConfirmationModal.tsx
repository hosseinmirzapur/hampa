import React from 'react';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'تایید',
  cancelText = 'انصراف',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-lg shadow-xl overflow-hidden animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700">
          <h3 className="font-bold text-lg dark:text-gray-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-neutral-700 flex justify-end space-x-2 space-x-reverse">
          <button
            onClick={onClose}
            className="btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-500 dark:border-neutral-500"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                <span>لطفا صبر کنید...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};