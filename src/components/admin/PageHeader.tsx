'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header-top">
        <div className="page-header-text">
          <h1 className="page-header-title">{title}</h1>
          {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
      <div className="page-header-divider" />
      <style jsx>{`
        .page-header {
          margin-bottom: 32px;
        }
        .page-header-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .page-header-text {
          flex: 1;
          min-width: 0;
        }
        .page-header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #3D2B1F;
          margin: 0;
          line-height: 1.2;
        }
        .page-header-subtitle {
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          color: #5a4638;
          margin: 6px 0 0 0;
          opacity: 0.8;
        }
        .page-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .page-header-divider {
          height: 1px;
          background: #C9A96E;
          opacity: 0.4;
          margin-top: 18px;
        }
      `}</style>
    </div>
  );
}
