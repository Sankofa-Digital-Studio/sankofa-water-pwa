import React from 'react';

export interface SparklineProps {
  values: number[];
  maxVal: number;
  colorFn: (v: number) => string;
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({
  values,
  maxVal,
  colorFn,
  width = 120,
  height = 32,
  className = '',
}: SparklineProps) {
  if (!values || values.length === 0) {
    return <svg width={width} height={height} className={className} aria-hidden="true" />;
  }

  const pad = 2;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const safeMax = maxVal === 0 ? 1 : maxVal;

  const points = values.map((v, i) => {
    const x = pad + (i / Math.max(values.length - 1, 1)) * innerW;
    const y = pad + innerH - (Math.min(v, safeMax) / safeMax) * innerH;
    return { x, y, v };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Build gradient stops based on colorFn
  const lastVal = values[values.length - 1];
  const strokeColor = colorFn(lastVal);

  return (
    <svg
      width={width}
      height={height}
      className={`overflow-visible ${className}`}
      aria-label="Pressure sparkline"
      role="img"
    >
      <polyline
        points={polyline}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />
      {points.map((p, i) =>
        i === points.length - 1 ? (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={strokeColor} />
        ) : null,
      )}
    </svg>
  );
}
