import React, { useEffect } from 'react';
import { X } from 'lucide-react';


interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 animate-in slide-in-from-right duration-300">
        <div className="w-screen max-w-md transform transition-transform ease-in-out duration-300 translate-x-0">
          <div className="flex h-full flex-col bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="relative flex-1 overflow-y-auto px-6 py-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
