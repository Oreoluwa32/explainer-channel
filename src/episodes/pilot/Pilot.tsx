import React from 'react';
import {Audio, Sequence, Series, staticFile} from 'remotion';
import timing from './timing.json';
import {Augustus, Debasement, Edict, Furnace, Hook, Outro} from './scenes';

const FPS = timing.fps;
// Silence before each line and after it, so cuts never clip the narration.
const LEAD = 0.25;
const TAIL = 0.45;

const SCENES: Record<string, React.FC<{dur: number}>> = {
  hook: Hook,
  augustus: Augustus,
  furnace: Furnace,
  debasement: Debasement,
  edict: Edict,
};

export const sceneFrames = timing.scenes.map((s) =>
  Math.ceil((s.seconds + LEAD + TAIL + (s.extraSeconds ?? 0)) * FPS),
);

export const pilotDuration = sceneFrames.reduce((a, b) => a + b, 0);

export const Pilot: React.FC = () => (
  <Series>
    {timing.scenes.map((s, i) => {
      const dur = sceneFrames[i];
      const Scene = SCENES[s.id];
      return (
        <Series.Sequence key={s.id} durationInFrames={dur} name={s.id}>
          {Scene ? <Scene dur={dur} /> : <Outro dur={dur} endCard={Math.round((s.extraSeconds ?? 0) * FPS)} />}
          {s.audio ? (
            <Sequence from={Math.round(LEAD * FPS)} name={`${s.id}-voice`}>
              <Audio src={staticFile(s.audio)} />
            </Sequence>
          ) : null}
        </Series.Sequence>
      );
    })}
  </Series>
);
