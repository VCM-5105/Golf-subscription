import React, { useEffect } from "react";
import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = "max-w-xl" }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Clean solid dark overlay - No glassmorphism / no backdrop-blur */}
      <div
        className="fixed inset-0 bg-[#121312]/60 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full ${maxWidth} bg-[#FAF8F5] border border-[#DDD7CD] rounded-xl shadow-xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#E8E3D8] bg-[#F5F2EB]">
          <div>
            <h3 className="text-xl font-medium text-[#181918] font-editorial tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#6B726C] mt-1 font-mono-code uppercase tracking-wider">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#787D78] hover:text-[#181918] hover:bg-[#EAE4D8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
