import React from 'react';
import {interpolateColors} from 'remotion';
import {C, F} from '../theme';

/**
 * A Roman coin. `silver` runs from 0 (all copper) to 1 (pure silver);
 * `spin` is the rotation angle in radians around the vertical axis.
 */
export const Coin: React.FC<{
  id: string;
  x: number;
  y: number;
  r: number;
  silver?: number;
  spin?: number;
  opacity?: number;
  glyph?: string;
}> = ({id, x, y, r, silver = 1, spin = 0, opacity = 1, glyph = 'AVG'}) => {
  const face = interpolateColors(silver, [0, 0.5, 1], [C.copper, '#B8957A', C.silver]);
  const light = interpolateColors(silver, [0, 1], ['#F0A777', '#FFFFFF']);
  const dark = interpolateColors(silver, [0, 1], ['#6E3418', '#6D7884']);
  const cos = Math.cos(spin);
  const sx = Math.max(0.03, Math.abs(cos));
  const edge = r * 0.12 * Math.abs(Math.sin(spin));
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <defs>
        <radialGradient id={`coin-${id}`} cx="34%" cy="28%" r="85%">
          <stop offset="0%" stopColor={light} />
          <stop offset="55%" stopColor={face} />
          <stop offset="100%" stopColor={dark} />
        </radialGradient>
      </defs>
      <ellipse cx={0} cy={r * 0.08} rx={r * sx + edge} ry={r} fill="#000" opacity={0.25} />
      <ellipse cx={cos >= 0 ? edge : -edge} cy={0} rx={r * sx} ry={r} fill={dark} />
      <g transform={`scale(${sx} 1)`}>
        <circle r={r * 0.93} fill={`url(#coin-${id})`} />
        <circle
          r={r * 0.8}
          fill="none"
          stroke={dark}
          strokeWidth={r * 0.035}
          strokeDasharray={`${r * 0.05} ${r * 0.07}`}
          opacity={0.75}
        />
        {cos >= 0 ? (
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily={F.display}
            fontWeight={900}
            fontSize={r * 0.46}
            fill={dark}
            opacity={0.85}
          >
            {glyph}
          </text>
        ) : (
          <g fill="none" stroke={dark} strokeWidth={r * 0.05} opacity={0.8} strokeLinecap="round">
            <path d={`M ${-r * 0.35} ${r * 0.25} Q 0 ${-r * 0.55} ${r * 0.35} ${r * 0.25}`} />
            <path d={`M ${-r * 0.2} ${r * 0.3} L ${r * 0.2} ${r * 0.3}`} />
          </g>
        )}
      </g>
    </g>
  );
};
