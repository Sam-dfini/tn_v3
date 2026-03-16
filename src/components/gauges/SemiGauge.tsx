'use client';
import { useEffect, useRef } from 'react';

interface SemiGaugeProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  status?: 'critical' | 'high' | 'medium' | 'low';
  sparkline?: number[];
  size?: number;
  showVoice?: boolean;
  voiceText?: string;
}

const STATUS_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e',
};

export default function SemiGauge({
  value, max, label, unit = '%', status = 'medium',
  sparkline = [], size = 120, showVoice = true, voiceText,
}: SemiGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pct = Math.min(value / max, 1);
  const color = STATUS_COLORS[status];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h * 0.78;
    const r = w * 0.42;

    ctx.clearRect(0, 0, w, h);

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, 0);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.stroke();

    // Value arc
    const endAngle = Math.PI + pct * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI, endAngle);
    ctx.lineWidth = 10;
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Needle
    const needleAngle = Math.PI + pct * Math.PI;
    const nx = cx + (r - 14) * Math.cos(needleAngle);
    const ny = cy + (r - 14) * Math.sin(needleAngle);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fff';
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Sparkline bars at bottom
    if (sparkline.length > 0) {
      const barW = 4;
      const gap = 3;
      const totalW = sparkline.length * (barW + gap) - gap;
      const startX = cx - totalW / 2;
      const maxSpark = Math.max(...sparkline);
      const minSpark = Math.min(...sparkline);
      const range = maxSpark - minSpark || 1;
      const maxH = 20;
      sparkline.forEach((v, i) => {
        const bh = ((v - minSpark) / range) * maxH + 4;
        const bx = startX + i * (barW + gap);
        const by = h - bh - 4;
        ctx.fillStyle = i === sparkline.length - 1 ? color : 'rgba(255,255,255,0.2)';
        ctx.fillRect(bx, by, barW, bh);
      });
    }
  }, [value, max, pct, color, sparkline]);

  const speak = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const text = voiceText || `${label}: ${value} ${unit}. Status: ${status}.`;
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0d1526, #070c18)',
      border: `1px solid ${color}22`,
      borderRadius: 12,
      padding: '12px 10px 8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
      minWidth: size,
    }}>
      <canvas ref={canvasRef} width={size} height={size * 0.65} style={{ display: 'block' }} />
      <div style={{
        fontSize: '1rem',
        fontWeight: 800,
        color,
        textShadow: `0 0 10px ${color}88`,
        lineHeight: 1,
      }}>
        {value}<span style={{ fontSize: '0.55rem', fontWeight: 400, color: '#64748b', marginLeft: 2 }}>{unit}</span>
      </div>
      <div style={{ fontSize: '0.6rem', color: '#94a3b8', textAlign: 'center', lineHeight: 1.3, fontWeight: 500 }}>
        {label}
      </div>
      <div style={{
        fontSize: '0.55rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        color,
        background: `${color}18`,
        padding: '2px 8px',
        borderRadius: 4,
      }}>
        {status.toUpperCase()}
      </div>
      {showVoice && (
        <button
          onClick={speak}
          style={{
            marginTop: 2,
            background: 'none',
            border: 'none',
            color: '#475569',
            fontSize: '0.55rem',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: 4,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#22d3ee')}
          onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
        >
          🔊 Read
        </button>
      )}
    </div>
  );
}
