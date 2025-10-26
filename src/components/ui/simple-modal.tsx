"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface SimpleModalProps {
  title?: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
}

export default function SimpleModal({
  title,
  subtitle,
  open,
  onClose,
  children,
  widthClass = "w-[85%]",
}: SimpleModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        className={`relative rounded-[28px] bg-[#0d0d0d] px-6 py-5 text-white ${widthClass}`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/60"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        {(title || subtitle) && (
          <div className="mb-4 pr-8">
            {title && (
              <h3 className="text-lg font-semibold text-[#52c340]">{title}</h3>
            )}
            {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
