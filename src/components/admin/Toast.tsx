'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  createdAt: number;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_COLORS: Record<ToastType, { color: string; bg: string }> = {
  success: { color: '#065f46', bg: '#d1fae5' },
  error: { color: '#991b1b', bg: '#fee2e2' },
  info: { color: '#1e40af', bg: '#dbeafe' },
};

const AUTO_DISMISS_MS = 4000;

function ToastItem({ toast, onClose }: { toast: Toast; onClose: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const remaining = Math.max(0, 100 - (elapsed / AUTO_DISMISS_MS) * 100);
      setProgress(remaining);
      if (remaining > 0) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        setVisible(false);
        setTimeout(() => onClose(toast.id), 300);
      }
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [toast.id, onClose]);

  const handleClose = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setVisible(false);
    setTimeout(() => onClose(toast.id), 300);
  };

  const { color, bg } = TOAST_COLORS[toast.type];

  return (
    <div className={`toast-item ${visible ? 'toast-visible' : ''}`}>
      <div className="toast-content">
        <span className="toast-message">{toast.message}</span>
        <button className="toast-close" onClick={handleClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>
      <div className="toast-progress-track">
        <div className="toast-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <style jsx>{`
        .toast-item {
          background: ${bg};
          color: ${color};
          border: 1px solid ${color}22;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          transform: translateX(120%);
          opacity: 0;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          min-width: 300px;
          max-width: 420px;
        }
        .toast-item.toast-visible {
          transform: translateX(0);
          opacity: 1;
        }
        .toast-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          gap: 12px;
        }
        .toast-message {
          flex: 1;
          line-height: 1.4;
        }
        .toast-close {
          background: none;
          border: none;
          color: ${color};
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          opacity: 0.7;
          transition: opacity 0.15s;
          flex-shrink: 0;
        }
        .toast-close:hover {
          opacity: 1;
        }
        .toast-progress-track {
          height: 3px;
          background: ${color}15;
        }
        .toast-progress-bar {
          height: 100%;
          background: ${color};
          transition: width 0.05s linear;
        }
      `}</style>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message, type, createdAt: Date.now() }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
      <style jsx>{`
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
        }
        .toast-container > :global(.toast-item) {
          pointer-events: auto;
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
