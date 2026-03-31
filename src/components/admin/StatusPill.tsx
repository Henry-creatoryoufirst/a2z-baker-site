'use client';

import React from 'react';

type OrderStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

interface StatusPillProps {
  status: OrderStatus;
  onChange: (status: OrderStatus) => void;
  disabled?: boolean;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  new: { label: 'New', color: '#f59e0b' },
  confirmed: { label: 'Confirmed', color: '#3b82f6' },
  completed: { label: 'Completed', color: '#10b981' },
  cancelled: { label: 'Cancelled', color: '#ef4444' },
};

const STATUSES: OrderStatus[] = ['new', 'confirmed', 'completed', 'cancelled'];

export default function StatusPill({ status, onChange, disabled = false }: StatusPillProps) {
  return (
    <div className={`status-pills ${disabled ? 'status-disabled' : ''}`}>
      {STATUSES.map((s) => {
        const { label, color } = STATUS_CONFIG[s];
        const active = s === status;
        return (
          <button
            key={s}
            className={`pill ${active ? 'pill-active' : ''}`}
            onClick={() => !disabled && onChange(s)}
            disabled={disabled}
            style={{
              '--pill-color': color,
              background: active ? color : 'transparent',
              color: active ? '#fff' : disabled ? '#aaa' : color,
              borderColor: disabled ? '#ddd' : color,
            } as React.CSSProperties}
          >
            {label}
          </button>
        );
      })}
      <style jsx>{`
        .status-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .pill {
          font-family: 'Outfit', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 999px;
          border: 1.5px solid;
          cursor: pointer;
          transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.15s ease;
          line-height: 1.3;
          white-space: nowrap;
        }
        .pill:hover:not(:disabled) {
          transform: scale(1.04);
        }
        .pill:not(.pill-active):hover:not(:disabled) {
          background: var(--pill-color, #ccc);
          color: #fff;
        }
        .status-disabled .pill {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
