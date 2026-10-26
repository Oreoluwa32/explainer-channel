import {Easing, interpolate, spring} from 'remotion';

export const clamp = {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

const easeOut = Easing.bezier(0.33, 1, 0.68, 1);

/** 0→1 over [start, start + length] frames, eased and clamped. */
export const prog = (
  frame: number,
  start: number,
  length: number,
  easing: (t: number) => number = easeOut,
) => interpolate(frame, [start, start + length], [0, 1], {...clamp, easing});

/** Springy 0→1 starting at `start`. */
export const pop = (frame: number, fps: number, start: number, damping = 12) =>
  spring({frame: frame - start, fps, config: {damping, stiffness: 170, mass: 0.8}});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
