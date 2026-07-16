import React from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "error" | "info";
}

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0" id="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-950/90 text-emerald-100 border-emerald-500/30"
                : toast.type === "error"
                ? "bg-rose-950/90 text-rose-100 border-rose-500/30"
                : "bg-zinc-900/95 text-zinc-100 border-zinc-700/50"
            }`}
            id={`toast-${toast.id}`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle className="h-5 w-5 text-emerald-400" id={`toast-icon-success-${toast.id}`} />}
              {toast.type === "error" && <AlertCircle className="h-5 w-5 text-rose-400" id={`toast-icon-error-${toast.id}`} />}
              {toast.type === "info" && <Info className="h-5 w-5 text-blue-400" id={`toast-icon-info-${toast.id}`} />}
            </div>
            <div className="flex-1 text-sm font-medium leading-tight">
              {toast.text}
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="flex-shrink-0 text-zinc-400 hover:text-zinc-200 transition-colors"
              aria-label="Close alert"
              id={`toast-close-${toast.id}`}
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
export default Toast;
