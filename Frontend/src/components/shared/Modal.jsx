import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-card-lg border border-gray-100 p-6 animate-scale-in"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-gray-900 text-lg">{title}</h3>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center
              text-gray-500 hover:text-gray-700 transition-colors text-sm font-bold">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
