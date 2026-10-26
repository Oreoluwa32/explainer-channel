import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {prog} from '../lib/anim';
import {C, F} from '../theme';

/**
 * Every scene draws into a 1920×1080 SVG viewBox; the SVG scales to the
 * composition size, so vectors stay sharp at 4K.
 */
export const Stage: React.FC<{children: React.ReactNode; shake?: number}> = ({
  children,
  shake = 0,
}) => {
  const frame = useCurrentFrame();
  const dx = shake ? Math.sin(frame * 2.3) * shake : 0;
  const dy = shake ? Math.cos(frame * 3.1) * shake * 0.7 : 0;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position: 'absolute'}}>
        <Backdrop />
        <g transform={`translate(${dx} ${dy})`}>{children}</g>
        <Vignette />
      </svg>
    </AbsoluteFill>
  );
};

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const dust = useMemo(
    () =>
      new Array(46).fill(0).map((_, i) => ({
        x: random(`dx${i}`) * 1920,
        y: random(`dy${i}`) * 1080,
        r: 1.2 + random(`dr${i}`) * 2.6,
        s: 0.15 + random(`ds${i}`) * 0.5,
        o: 0.08 + random(`do${i}`) * 0.25,
      })),
    [],
  );
  return (
    <g>
      <defs>
        <radialGradient id="bg-grad" cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor={C.bg2} />
          <stop offset="100%" stopColor={C.bg} />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#bg-grad)" />
      {dust.map((d, i) => (
        <circle
          key={i}
          cx={d.x + Math.sin((frame + i * 23) / 80) * 18}
          cy={(((d.y - frame * d.s) % 1080) + 1080) % 1080}
          r={d.r}
          fill={C.parchment}
          opacity={d.o}
        />
      ))}
    </g>
  );
};

const Vignette: React.FC = () => (
  <g pointerEvents="none">
    <defs>
      <radialGradient id="vignette" cx="50%" cy="50%" r="72%">
        <stop offset="62%" stopColor="#000" stopOpacity={0} />
        <stop offset="100%" stopColor="#000" stopOpacity={0.55} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#vignette)" />
  </g>
);

/** Small rounded label, e.g. "ROME · AD 300". */
export const Chip: React.FC<{
  x: number;
  y: number;
  text: string;
  appear: number;
  active?: boolean;
  anchor?: 'start' | 'middle';
}> = ({x, y, text, appear, active = true, anchor = 'start'}) => {
  const w = text.length * 19 + 56;
  const left = anchor === 'middle' ? x - w / 2 : x;
  return (
    <g opacity={appear} transform={`translate(0 ${(1 - appear) * 20})`}>
      <rect
        x={left}
        y={y - 32}
        width={w}
        height={64}
        rx={32}
        fill={active ? C.gold : 'none'}
        stroke={C.gold}
        strokeWidth={3}
        opacity={active ? 1 : 0.6}
      />
      <text
        x={left + w / 2}
        y={y + 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily={F.body}
        fontWeight={800}
        fontSize={28}
        letterSpacing={3}
        fill={active ? C.ink : C.gold}
      >
        {text}
      </text>
    </g>
  );
};

/** Line of text that rises and fades in. */
export const RiseText: React.FC<{
  x: number;
  y: number;
  start: number;
  children: React.ReactNode;
  size: number;
  color?: string;
  family?: string;
  weight?: number;
  anchor?: 'start' | 'middle' | 'end';
  spacing?: number;
}> = ({x, y, start, children, size, color = C.parchment, family = F.display, weight = 900, anchor = 'start', spacing = 2}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, start, 14);
  return (
    <text
      x={x}
      y={y + (1 - p) * 40}
      opacity={p}
      textAnchor={anchor}
      fontFamily={family}
      fontWeight={weight}
      fontSize={size}
      letterSpacing={spacing}
      fill={color}
    >
      {children}
    </text>
  );
};
