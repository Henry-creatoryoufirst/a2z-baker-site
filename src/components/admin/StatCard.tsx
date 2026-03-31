'use client';

import React, { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

function useCountUp(target: number, duration = 600): number {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return current;
}

export default function StatCard({ label, value, icon, color, trend }: StatCardProps) {
  const displayValue = useCountUp(value);

  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon-wrap">{icon}</div>
        {trend !== undefined && (
          <div className={`stat-trend ${trend >= 0 ? 'trend-up' : 'trend-down'}`}>
            {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div className="stat-value">{displayValue.toLocaleString()}</div>
      <div className="stat-label">{label}</div>
      <style jsx>{`
        .stat-card {
          background: linear-gradient(135deg, ${color}0D 0%, transparent 60%);
          border-left: 4px solid ${color};
          border-radius: 10px;
          padding: 22px 24px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: default;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .stat-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: ${color}1A;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${color};
        }
        .stat-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 20px;
        }
        .trend-up {
          color: #065f46;
          background: #d1fae5;
        }
        .trend-down {
          color: #991b1b;
          background: #fee2e2;
        }
        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.2rem;
          font-weight: 700;
          color: #3D2B1F;
          line-height: 1.1;
          margin-bottom: 4px;
        }
        .stat-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          color: #5a4638;
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  );
}
