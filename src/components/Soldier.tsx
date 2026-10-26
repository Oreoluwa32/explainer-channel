import React from 'react';
import {C, F} from '../theme';

/**
 * A legionary holding a coin purse. Origin is between the feet.
 * `sad` 0→1 bends the brows and mouth; `bulge` scales the purse;
 * `growl` 0→1 shows stomach-rumble marks.
 */
export const Soldier: React.FC<{
  x: number;
  y: number;
  scale?: number;
  sad?: number;
  bulge?: number;
  growl?: number;
  frame: number;
}> = ({x, y, scale = 1, sad = 0, bulge = 1, growl = 0, frame}) => {
  const mouthCtrl = -456 - 30 * sad;
  const breathe = Math.sin(frame / 12) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={0} rx={160} ry={20} fill="#000" opacity={0.3} />
      {/* legs + sandals */}
      <rect x={-58} y={-125} width={38} height={115} rx={14} fill={C.skin} />
      <rect x={20} y={-125} width={38} height={115} rx={14} fill={C.skin} />
      <rect x={-66} y={-22} width={54} height={22} rx={8} fill={C.leather} />
      <rect x={12} y={-22} width={54} height={22} rx={8} fill={C.leather} />
      <g transform={`translate(0 ${breathe})`}>
        {/* tunic skirt */}
        <path d="M -122 -255 L 122 -255 L 142 -112 L -142 -112 Z" fill={C.red} />
        {new Array(8).fill(0).map((_, i) => (
          <rect key={i} x={-124 + i * 32} y={-185} width={24} height={78} rx={6} fill={C.leather} />
        ))}
        {/* armour */}
        <rect x={-128} y={-425} width={256} height={190} rx={44} fill={C.steel} />
        {[-385, -345, -305].map((ly) => (
          <line key={ly} x1={-120} x2={120} y1={ly} y2={ly} stroke={C.steelDark} strokeWidth={7} />
        ))}
        <rect x={-130} y={-262} width={260} height={28} rx={10} fill={C.leather} />
        <ellipse cx={-128} cy={-400} rx={48} ry={36} fill={C.steel} stroke={C.steelDark} strokeWidth={5} />
        <ellipse cx={128} cy={-400} rx={48} ry={36} fill={C.steel} stroke={C.steelDark} strokeWidth={5} />
        {/* arms reaching to the purse */}
        <path d="M -150 -395 Q -170 -320 -82 -300" stroke={C.skin} strokeWidth={42} fill="none" strokeLinecap="round" />
        <path d="M 150 -395 Q 170 -320 82 -300" stroke={C.skin} strokeWidth={42} fill="none" strokeLinecap="round" />
        {/* purse */}
        <g transform={`translate(0 -292) scale(${bulge})`}>
          <path
            d="M -78 -8 Q -112 82 0 88 Q 112 82 78 -8 Q 44 -44 0 -38 Q -44 -44 -78 -8 Z"
            fill={C.leather}
            stroke="#4F2E18"
            strokeWidth={5}
          />
          <rect x={-40} y={-44} width={80} height={16} rx={8} fill="#4F2E18" />
          <circle cx={-18} cy={-56} r={16} fill={C.silver} stroke={C.steelDark} strokeWidth={3} />
          <circle cx={14} cy={-60} r={16} fill={C.silver} stroke={C.steelDark} strokeWidth={3} />
          <path d="M -40 30 Q 0 52 40 30" stroke="#4F2E18" strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
        <circle cx={-82} cy={-300} r={24} fill={C.skin} />
        <circle cx={82} cy={-300} r={24} fill={C.skin} />
        {/* neck + head */}
        <rect x={-26} y={-458} width={52} height={44} fill={C.skin} />
        <circle cx={0} cy={-522} r={80} fill={C.skin} />
        <circle cx={-30} cy={-500} r={9} fill={C.ink} />
        <circle cx={30} cy={-500} r={9} fill={C.ink} />
        <path d={`M -48 -524 L -14 ${-530 - 10 * sad}`} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
        <path d={`M 14 ${-530 - 10 * sad} L 48 -524`} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
        <path d="M 0 -500 Q 10 -484 0 -478" stroke="#B9805A" strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d={`M -24 -462 Q 0 ${mouthCtrl} 24 -462`} stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
        {/* helmet */}
        <path d="M -90 -530 A 90 90 0 0 1 90 -530 Z" fill={C.steel} />
        <rect x={-100} y={-542} width={200} height={20} rx={10} fill={C.steelDark} />
        <rect x={-98} y={-530} width={26} height={74} rx={10} fill={C.steel} />
        <rect x={72} y={-530} width={26} height={74} rx={10} fill={C.steel} />
        <path d="M -66 -606 Q 0 -682 66 -606" stroke={C.red} strokeWidth={40} fill="none" strokeLinecap="round" />
        <path d="M -66 -606 Q 0 -682 66 -606" stroke={C.redDark} strokeWidth={6} strokeDasharray="4 14" fill="none" />
      </g>
      {/* stomach growl */}
      <g opacity={growl} stroke={C.gold} strokeWidth={7} fill="none" strokeLinecap="round">
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${170 + i * 26} ${-330 + i * 6} q 12 22 0 44 q -12 22 0 44`}
            transform={`translate(${Math.sin(frame * 1.7 + i) * 4} 0)`}
          />
        ))}
        <text x={260} y={-330} fontFamily={F.body} fontWeight={800} fontSize={38} fill={C.gold} stroke="none">
          grrr…
        </text>
      </g>
    </g>
  );
};
