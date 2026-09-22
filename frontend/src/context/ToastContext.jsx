import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg, dur) => addToast(msg, "success", dur), [addToast]);
  const error = useCallback((msg, dur) => addToast(msg, "error", dur), [addToast]);
  const info = useCallback((msg, dur) => addToast(msg, "info", dur), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              t.type === "success"
                ? "bg-[#F4F7F4] border-[#2D483A]/30 text-[#1E2E24]"
                : t.type === "error"
                ? "bg-[#FDF3F3] border-[#8C2C2C]/30 text-[#5C1A1A]"
                : "bg-[#F9F7F2] border-[#D1CAC0] text-[#181918]"
            }`}
          >
            {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#2D483A] shrink-0 mt-0.5" />}
            {t.type === "error" && <AlertCircle className="w-5 h-5 text-[#8C2C2C] shrink-0 mt-0.5" />}
            {t.type === "info" && <Info className="w-5 h-5 text-[#6B726C] shrink-0 mt-0.5" />}

            <div className="text-sm font-medium leading-relaxed flex-1">{t.message}</div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-[#8A8F8A] hover:text-[#181918] p-0.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
