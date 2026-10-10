import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/40',
    error: 'border-rose-500/30 bg-rose-950/40',
    warning: 'border-amber-500/30 bg-amber-950/40',
    info: 'border-indigo-500/30 bg-indigo-950/40',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 text-xs text-white ${
            borders[toast.type] || borders.info
          }`}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <div className="font-semibold">{toast.title}</div>
            {toast.message && <div className="text-[11px] text-slate-300 mt-0.5">{toast.message}</div>}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
