import React from 'react';
import {interpolate, interpolateColors, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Coin} from '../../components/Coin';
import {Soldier} from '../../components/Soldier';
import {Chip, RiseText, Stage} from '../../components/Stage';
import {clamp, lerp, pop, prog} from '../../lib/anim';
import {C, CHANNEL_NAME, F} from '../../theme';

type SceneProps = {dur: number};

// ── 1. Hook: paid in coins, still hungry ──────────────────────────────────
export const Hook: React.FC<SceneProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = pop(frame, fps, 0, 14);
  const growlAt = Math.round(dur * 0.3);
  const titleAt = Math.round(dur * 0.5);
  const growl = interpolate(frame, [growlAt, growlAt + 6, titleAt + 20, titleAt + 34], [0, 1, 1, 0], clamp);
  const sad = prog(frame, growlAt, 12);
  const bulge = 1 + Math.max(0, Math.sin(frame / 7)) * 0.05 * (1 - sad) + 0.12;
  return (
    <Stage>
      <Chip x={90} y={100} text="ROME · AD 300" appear={prog(frame, 4, 12)} />
      <Soldier x={560} y={lerp(1500, 960, enter)} scale={1.12} sad={sad} bulge={bulge} growl={growl} frame={frame} />
      {[0, 1, 2].map((i) => {
        const t = ((frame + i * 14) % 42) / 42;
        const visible = frame < growlAt;
        return (
          <Coin
            key={i}
            id={`toss${i}`}
            x={560 + (i - 1) * 140 * t}
            y={600 - 420 * 4 * t * (1 - t)}
            r={34}
            spin={t * Math.PI * 4}
            opacity={visible ? 1 : 0}
          />
        );
      })}
      <g transform="translate(1000 0)">
        <RiseText x={0} y={430} start={titleAt} size={92}>HOW ROME</RiseText>
        <RiseText x={0} y={545} start={titleAt + 6} size={92}>PRINTED ITSELF</RiseText>
        <RiseText x={0} y={690} start={titleAt + 12} size={150} color={C.gold}>BROKE</RiseText>
        <rect x={4} y={730} width={lerp(0, 560, prog(frame, titleAt + 18, 16))} height={8} rx={4} fill={C.gold} />
      </g>
    </Stage>
  );
};

// ── 2. Augustus: nearly pure silver, but empires are expensive ────────────
const Shield: React.FC = () => (
  <g>
    <rect x={-34} y={-46} width={68} height={92} rx={14} fill={C.red} stroke={C.gold} strokeWidth={5} />
    <circle r={14} fill={C.gold} />
  </g>
);
const Road: React.FC = () => (
  <g>
    <path d="M -18 -46 L 18 -46 L 46 46 L -46 46 Z" fill={C.stone} />
    <path d="M 0 -40 L 0 40" stroke={C.parchment} strokeWidth={6} strokeDasharray="12 12" />
  </g>
);
const Bread: React.FC = () => (
  <g>
    <ellipse rx={50} ry={32} fill="#D9A15A" stroke="#9C6524" strokeWidth={5} />
    {[-22, 0, 22].map((dx) => (
      <path key={dx} d={`M ${dx - 8} -18 L ${dx + 8} 18`} stroke="#9C6524" strokeWidth={5} strokeLinecap="round" />
    ))}
  </g>
);

export const Augustus: React.FC<SceneProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const coinIn = pop(frame, fps, 0, 15);
  const spin = interpolate(frame, [0, dur * 0.32], [Math.PI * 6, 0], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const costs = [
    {at: 0.42, label: 'LEGIONS', icon: <Shield />},
    {at: 0.58, label: 'ROADS', icon: <Road />},
    {at: 0.72, label: 'FREE BREAD', icon: <Bread />},
  ];
  const shown = costs.map((c) => pop(frame, fps, Math.round(dur * c.at), 13));
  const drain = costs.map((c) => prog(frame, Math.round(dur * c.at) + 6, 22));
  const level = 1 - 0.27 * drain.reduce((a, b) => a + b, 0);
  const gaugeTop = 220;
  const gaugeH = 620;
  return (
    <Stage>
      <Coin id="aug" x={560} y={470} r={240 * coinIn} spin={spin} />
      <RiseText x={560} y={810} start={Math.round(dur * 0.16)} size={52} anchor="middle">
        DENARIUS OF AUGUSTUS
      </RiseText>
      <RiseText x={560} y={890} start={Math.round(dur * 0.22)} size={44} anchor="middle" color={C.gold} family={F.body} weight={800}>
        ≈ 95% SILVER
      </RiseText>
      {costs.map((c, i) => (
        <g key={c.label} transform={`translate(1130 ${310 + i * 230}) scale(${shown[i]})`} opacity={Math.min(1, shown[i])}>
          <circle r={78} fill={C.bg} stroke={C.parchmentDim} strokeWidth={4} />
          {c.icon}
          <text x={0} y={128} textAnchor="middle" fontFamily={F.body} fontWeight={800} fontSize={32} letterSpacing={3} fill={C.parchment}>
            {c.label}
          </text>
          <path d="M 100 0 L 230 0" stroke={C.red} strokeWidth={8} strokeDasharray="14 12" opacity={drain[i]} />
        </g>
      ))}
      <g opacity={prog(frame, Math.round(dur * 0.36), 12)}>
        <text x={1520} y={gaugeTop - 40} textAnchor="middle" fontFamily={F.body} fontWeight={800} fontSize={34} letterSpacing={4} fill={C.parchment}>
          TREASURY
        </text>
        <rect x={1420} y={gaugeTop} width={200} height={gaugeH} rx={24} fill="none" stroke={C.parchment} strokeWidth={6} />
        <rect
          x={1432}
          y={gaugeTop + 12 + (gaugeH - 24) * (1 - level)}
          width={176}
          height={(gaugeH - 24) * level}
          rx={14}
          fill={interpolateColors(level, [0.2, 0.6, 1], [C.red, C.gold, C.gold])}
        />
      </g>
    </Stage>
  );
};

// ── 3. Furnace: melt, mix, mint more ──────────────────────────────────────
export const Furnace: React.FC<SceneProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = Math.round(dur * 0.06);
  const b = Math.round(dur * 0.38);
  const c = Math.round(dur * 0.64);
  const phase = frame < b ? 0 : frame < c ? 1 : 2;
  const mix = prog(frame, b + 8, 30);
  const liquidColor = interpolateColors(mix, [0, 1], [C.silver, '#C98A5A']);
  const fill = 0.35 + 0.25 * prog(frame, a, b - a) + 0.25 * mix - 0.3 * prog(frame, c, 26);
  const falling = (start: number, x: number, key: string, node: (y: number) => React.ReactNode) => {
    const t = prog(frame, start, 18, (v) => v * v);
    if (frame < start || t >= 1) return null;
    return <g key={key}>{node(lerp(-120, 560, t))}</g>;
  };
  const outCoins = new Array(6).fill(0).map((_, i) => pop(frame, fps, c + 10 + i * 5, 11));
  return (
    <Stage>
      <Chip x={560} y={120} text="1  MELT" appear={prog(frame, 2, 10)} active={phase === 0} anchor="middle" />
      <Chip x={960} y={120} text="2  MIX" appear={prog(frame, 6, 10)} active={phase === 1} anchor="middle" />
      <Chip x={1360} y={120} text="3  MINT MORE" appear={prog(frame, 10, 10)} active={phase === 2} anchor="middle" />
      {/* incoming silver coins */}
      {[0, 1, 2].map((i) =>
        falling(a + i * 12, 900 + (i - 1) * 60, `s${i}`, (y) => (
          <Coin id={`in${i}`} x={900 + (i - 1) * 60} y={y} r={46} spin={y / 90} />
        )),
      )}
      <RiseText x={330} y={520} start={a} size={44} anchor="middle" family={F.body} weight={800}>
        3 COINS
      </RiseText>
      {/* cheap copper chunks */}
      {[0, 1, 2].map((i) =>
        falling(b + i * 10, 960, `c${i}`, (y) => (
          <rect x={920 + (i - 1) * 50} y={y - 24} width={64} height={44} rx={10} fill={C.copper} stroke="#6E3418" strokeWidth={4} transform={`rotate(${i * 25} ${950 + (i - 1) * 50} ${y})`} />
        )),
      )}
      <g opacity={interpolate(frame, [b, b + 10, c, c + 10], [0, 1, 1, 0.35], clamp)}>
        <text x={330} y={640} textAnchor="middle" fontFamily={F.body} fontWeight={800} fontSize={40} fill={C.copper}>
          + CHEAP COPPER
        </text>
      </g>
      {/* flames */}
      {[-120, -60, 0, 60, 120].map((dx, i) => {
        const h = 90 + Math.sin(frame / 3 + i * 1.7) * 18 + random(`f${i}`) * 20;
        return (
          <path
            key={dx}
            d={`M ${960 + dx - 34} 900 Q ${960 + dx - 30} ${900 - h * 0.6} ${960 + dx} ${900 - h} Q ${960 + dx + 30} ${900 - h * 0.6} ${960 + dx + 34} 900 Z`}
            fill={i % 2 ? C.gold : '#E86A2C'}
            opacity={0.95}
          />
        );
      })}
      {/* crucible */}
      <path d="M 760 560 L 1160 560 Q 1150 800 960 820 Q 770 800 760 560 Z" fill={C.stoneDark} stroke={C.ink} strokeWidth={6} />
      <clipPath id="crucible-clip">
        <path d="M 772 570 L 1148 570 Q 1138 790 960 808 Q 782 790 772 570 Z" />
      </clipPath>
      <g clipPath="url(#crucible-clip)">
        <rect x={760} y={570 + 240 * (1 - fill)} width={400} height={300} fill={liquidColor} />
        <ellipse cx={960} cy={570 + 240 * (1 - fill)} rx={200} ry={14} fill="#fff" opacity={0.35} />
      </g>
      <rect x={740} y={548} width={440} height={26} rx={13} fill={C.stone} />
      {/* minted output */}
      {outCoins.map((p, i) => (
        <Coin
          key={i}
          id={`out${i}`}
          x={1380 + (i % 3) * 130}
          y={560 + Math.floor(i / 3) * 140}
          r={52 * p}
          silver={0.45}
          opacity={Math.min(1, p)}
        />
      ))}
      <g opacity={prog(frame, c + 40, 12)}>
        <text x={1640} y={840} textAnchor="middle" fontFamily={F.body} fontWeight={800} fontSize={44} fill={C.gold}>
          6 COINS
        </text>
      </g>
    </Stage>
  );
};

// ── 4. Debasement chart: silver content collapses ─────────────────────────
const DATA = [
  {year: 14, v: 95, label: 'AUGUSTUS', dx: 0, dy: -36, anchor: 'start'},
  {year: 64, v: 93, label: 'NERO', dx: 0, dy: 62, anchor: 'middle'},
  {year: 180, v: 75, label: 'MARCUS AURELIUS', dx: 20, dy: -34, anchor: 'start'},
  {year: 211, v: 50, label: 'SEPTIMIUS SEVERUS', dx: -26, dy: 10, anchor: 'end'},
  {year: 268, v: 4, label: 'GALLIENUS', dx: -70, dy: -24, anchor: 'end'},
];
const X0 = 300;
const X1 = 1600;
const Y0 = 900;
const Y1 = 300;
const px = (year: number) => X0 + ((X1 - X0) * year) / 300;
const py = (v: number) => Y0 - ((Y0 - Y1) * v) / 100;

export const Debasement: React.FC<SceneProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const pts = DATA.map((d) => ({x: px(d.year), y: py(d.v), ...d}));
  const segs = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  const total = segs.reduce((a, b) => a + b, 0);
  const t = prog(frame, Math.round(dur * 0.1), Math.round(dur * 0.72), (v) => v);
  let remaining = t * total;
  let head = pts[0];
  let value = pts[0].v;
  let reached = 0;
  for (let i = 0; i < segs.length; i++) {
    if (remaining >= segs[i]) {
      remaining -= segs[i];
      head = pts[i + 1];
      value = pts[i + 1].v;
      reached = i + 1;
      continue;
    }
    const k = remaining / segs[i];
    head = {...pts[i], x: lerp(pts[i].x, pts[i + 1].x, k), y: lerp(pts[i].y, pts[i + 1].y, k)};
    value = lerp(pts[i].v, pts[i + 1].v, k);
    break;
  }
  const axes = prog(frame, 0, 14);
  const pathD = pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
  return (
    <Stage>
      <RiseText x={X0} y={170} start={0} size={56}>
        SILVER IN ONE “SILVER” COIN
      </RiseText>
      <g opacity={axes}>
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={X0} x2={X1} y1={py(v)} y2={py(v)} stroke={C.parchment} strokeWidth={2} opacity={0.12} />
            <text x={X0 - 24} y={py(v) + 12} textAnchor="end" fontFamily={F.body} fontWeight={700} fontSize={30} fill={C.parchmentDim}>
              {v}%
            </text>
          </g>
        ))}
        {[0, 100, 200, 300].map((yr) => (
          <text key={yr} x={px(yr)} y={Y0 + 56} textAnchor="middle" fontFamily={F.body} fontWeight={700} fontSize={30} fill={C.parchmentDim}>
            AD {yr}
          </text>
        ))}
        <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke={C.parchment} strokeWidth={4} />
      </g>
      <path
        d={pathD}
        fill="none"
        stroke={C.gold}
        strokeWidth={10}
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={`${t * total} ${total}`}
      />
      {pts.map((p, i) => {
        const on = i <= reached ? prog(frame, 0, 1) : 0;
        return (
          <g key={p.label} opacity={on}>
            <circle cx={p.x} cy={p.y} r={12} fill={C.gold} />
            <text
              x={p.x + p.dx}
              y={p.y + p.dy}
              textAnchor={p.anchor as 'start' | 'middle' | 'end'}
              fontFamily={F.body}
              fontWeight={800}
              fontSize={26}
              letterSpacing={2}
              fill={C.parchment}
            >
              {p.label} · AD {p.year}
            </text>
          </g>
        );
      })}
      <Coin id="head" x={head.x} y={head.y} r={46} silver={value / 100} />
      <g opacity={prog(frame, Math.round(dur * 0.08), 10)}>
        <text x={1720} y={300} textAnchor="end" fontFamily={F.display} fontWeight={900} fontSize={150} fill={interpolateColors(value, [5, 50, 95], [C.copper, C.gold, C.silver])}>
          {Math.round(value)}%
        </text>
        <text x={1720} y={350} textAnchor="end" fontFamily={F.body} fontWeight={700} fontSize={28} letterSpacing={3} fill={C.parchmentDim}>
          SILVER CONTENT
        </text>
      </g>
      <text x={X1} y={1030} textAnchor="end" fontFamily={F.body} fontWeight={500} fontSize={22} fill={C.parchmentDim} opacity={0.7}>
        Approximate values from numismatic studies of the denarius and antoninianus
      </text>
    </Stage>
  );
};

// ── 5. Edict: prices soar, Diocletian fixes them by law, it fails ─────────
const Tag: React.FC<{x: number; y: number; s: number; label: string}> = ({x, y, s, label}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -110 -60 L 70 -60 L 120 0 L 70 60 L -110 60 Z" fill={C.parchment} stroke={C.goldDark} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={80} cy={0} r={11} fill={C.bg} />
    <text x={-20} y={14} textAnchor="middle" fontFamily={F.body} fontWeight={800} fontSize={40} fill={C.ink}>
      {label}
    </text>
    <path d="M -20 -100 L -20 -76 M -34 -88 L -20 -102 L -6 -88" stroke={C.red} strokeWidth={7} fill="none" strokeLinecap="round" />
  </g>
);

export const Edict: React.FC<SceneProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slamAt = Math.round(dur * 0.36);
  const failAt = Math.round(dur * 0.78);
  const rise1 = prog(frame, 0, slamAt);
  const slam = pop(frame, fps, slamAt, 9);
  const squash = interpolate(frame, [slamAt + 4, slamAt + 12], [0, 1], clamp);
  const rise2 = prog(frame, failAt - 6, dur - failAt);
  const impact = interpolate(frame, [slamAt + 4, slamAt + 22], [14, 0], clamp);
  const tags = ['BREAD', 'WINE', 'OIL'];
  const tagY = (i: number) => {
    const up = lerp(860, 620 - i * 30, rise1);
    const pinned = lerp(up, 900, squash);
    return lerp(pinned, 150 + i * 40, rise2);
  };
  const tagS = lerp(lerp(1, 1.45, rise1), 1, squash) * lerp(1, 1.5, rise2);
  return (
    <Stage shake={frame > slamAt + 3 ? impact : 0}>
      <g opacity={1 - prog(frame, slamAt - 8, 8)}>
        <RiseText x={960} y={160} start={2} size={64} anchor="middle" color={C.gold}>
          PRICES SOAR
        </RiseText>
      </g>
      <g transform={`translate(960 ${lerp(-520, 470, slam)})`}>
        <path d="M -360 -230 Q 0 -310 360 -230 L 360 210 L -360 210 Z" fill={C.stone} stroke={C.stoneDark} strokeWidth={10} />
        <text y={-140} textAnchor="middle" fontFamily={F.display} fontWeight={900} fontSize={50} fill={C.ink}>
          EDICT ON
        </text>
        <text y={-70} textAnchor="middle" fontFamily={F.display} fontWeight={900} fontSize={50} fill={C.ink}>
          MAXIMUM PRICES
        </text>
        <text y={20} textAnchor="middle" fontFamily={F.display} fontWeight={700} fontSize={40} fill={C.stoneDark}>
          DIOCLETIAN · AD 301
        </text>
        <text y={130} textAnchor="middle" fontFamily={F.display} fontWeight={900} fontSize={54} fill={C.redDark}>
          PENALTY: DEATH
        </text>
        <path
          d="M -40 -260 L 10 -170 L -30 -80 L 30 20 L -10 110 L 40 210"
          fill="none"
          stroke={C.ink}
          strokeWidth={8}
          strokeDasharray="700"
          strokeDashoffset={700 * (1 - prog(frame, failAt - 10, 16))}
        />
      </g>
      {tags.map((label, i) => (
        <Tag key={label} x={560 + i * 400} y={tagY(i)} s={tagS} label={label} />
      ))}
      <g opacity={prog(frame, failAt + 4, 8)} transform={`translate(1450 860) rotate(-12) scale(${lerp(1.6, 1, prog(frame, failAt + 4, 8))})`}>
        <rect x={-190} y={-62} width={380} height={124} rx={14} fill="none" stroke={C.red} strokeWidth={10} />
        <text y={26} textAnchor="middle" fontFamily={F.display} fontWeight={900} fontSize={80} fill={C.red}>
          FAILED
        </text>
      </g>
    </Stage>
  );
};

// ── 6. Outro: coin becomes a banknote; end card ───────────────────────────
const Banknote: React.FC<{x: number; y: number; s: number; r?: number; o?: number}> = ({x, y, s, r = 0, o = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s} ${Math.abs(s) > 0 ? 1 : 0})`} opacity={o}>
    <rect x={-380} y={-180} width={760} height={360} rx={18} fill={C.green} stroke={C.greenDark} strokeWidth={10} />
    <rect x={-340} y={-140} width={680} height={280} rx={10} fill="none" stroke={C.greenDark} strokeWidth={4} />
    <ellipse rx={110} ry={120} fill="#A9D2B0" stroke={C.greenDark} strokeWidth={6} />
    {[
      [-240, -70],
      [240, 120],
    ].map(([tx, ty]) => (
      <text key={tx} x={tx} y={ty} textAnchor="middle" fontFamily={F.display} fontWeight={900} fontSize={66} fill={C.greenDark}>
        100
      </text>
    ))}
  </g>
);

export const Outro: React.FC<SceneProps & {endCard: number}> = ({dur, endCard}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const morphAt = Math.round((dur - endCard) * 0.3);
  const coinSpin = interpolate(frame, [0, morphAt], [0, Math.PI * 4.5], clamp);
  const note = prog(frame, morphAt, 12);
  const familiarAt = Math.round((dur - endCard) * 0.62);
  const endAt = dur - endCard;
  const end = prog(frame, endAt, 16);
  const flutter = new Array(8).fill(0).map((_, i) => {
    const start = morphAt + 10 + i * 6;
    const t = (frame - start) / 70;
    return {
      x: 200 + random(`nx${i}`) * 1520,
      y: lerp(-250, 1300, t),
      r: Math.sin(frame / 14 + i) * 25,
      on: frame > start ? 0.35 : 0,
    };
  });
  return (
    <Stage>
      <g opacity={1 - end}>
        {flutter.map((n, i) => (
          <Banknote key={i} x={n.x} y={n.y} s={0.35} r={n.r} o={n.on} />
        ))}
        {frame < morphAt ? (
          <Coin id="final" x={960} y={480} r={230} spin={coinSpin} silver={0.15} />
        ) : (
          <Banknote x={960} y={480} s={note} />
        )}
        <RiseText x={960} y={880} start={familiarAt} size={110} anchor="middle" color={C.gold}>
          SOUND FAMILIAR?
        </RiseText>
      </g>
      <g opacity={end} transform={`translate(960 ${lerp(560, 520, end)})`}>
        <Coin id="logo" x={0} y={-150} r={110} silver={1} glyph="WW" spin={0} />
        <text y={60} textAnchor="middle" fontFamily={F.display} fontWeight={900} fontSize={110} letterSpacing={10} fill={C.parchment}>
          {CHANNEL_NAME}
        </text>
        <text y={130} textAnchor="middle" fontFamily={F.body} fontWeight={700} fontSize={34} letterSpacing={6} fill={C.parchmentDim}>
          HISTORY · SCIENCE · MONEY · TECH
        </text>
        <g transform={`translate(0 250) scale(${pop(frame, fps, endAt + 14, 10)})`}>
          <rect x={-200} y={-50} width={400} height={100} rx={50} fill={C.red} />
          <text y={14} textAnchor="middle" fontFamily={F.body} fontWeight={800} fontSize={40} letterSpacing={4} fill="#fff">
            SUBSCRIBE
          </text>
        </g>
      </g>
    </Stage>
  );
};
