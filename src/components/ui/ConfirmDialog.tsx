import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'warning' | 'danger' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const variantStyles = {
  warning: {
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    iconBorder: 'border-amber-500/20',
    button: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/20',
    buttonFocus: 'focus:ring-amber-500/50',
  },
  danger: {
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-400',
    iconBorder: 'border-red-500/20',
    button: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20',
    buttonFocus: 'focus:ring-red-500/50',
  },
  info: {
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    iconBorder: 'border-blue-500/20',
    button: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20',
    buttonFocus: 'focus:ring-blue-500/50',
  },
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'warning',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const styles = variantStyles[variant];

  // Focus trap + keyboard handling
  useEffect(() => {
    if (!open) return;

    // Focus the confirm button on open
    const timer = setTimeout(() => confirmBtnRef.current?.focus(), 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200 overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-2xl ${styles.iconBg} ${styles.iconBorder} border flex items-center justify-center ${styles.iconColor} mb-5`}>
            <AlertTriangle size={28} />
          </div>

          {/* Title */}
          <h2
            id="confirm-dialog-title"
            className="text-lg font-semibold text-white mb-2"
          >
            {title}
          </h2>

          {/* Description */}
          <p className="text-sm text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium rounded-lg text-slate-300 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500/50"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            onClick={onConfirm}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 ${styles.button} ${styles.buttonFocus}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
