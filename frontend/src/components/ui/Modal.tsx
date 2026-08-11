import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm':
        return 'max-w-sm';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case '2xl':
        return 'max-w-2xl';
      default:
        return 'max-w-md';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002A1C]/60 dark:bg-slate-950/80 backdrop-blur-sm">
      <div
        className={`w-full ${getMaxWidthClass()} bg-[#FFFBF7] dark:bg-slate-900 border border-[#F3CEA6] dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150 text-[#002A1C] dark:text-slate-100`}
      >
        <div className="px-6 py-4 bg-[#FFE4C4] dark:bg-slate-900 border-b border-[#F3CEA6] dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#002A1C] dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-[#6B5542] hover:text-[#002A1C] dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-[#F3CEA6]/50 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
