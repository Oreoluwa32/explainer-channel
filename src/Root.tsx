import React from 'react';
import {Composition} from 'remotion';
import './theme';
import {Pilot, pilotDuration} from './episodes/pilot/Pilot';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Pilot" component={Pilot} durationInFrames={pilotDuration} fps={30} width={3840} height={2160} />
    <Composition id="PilotPreview" component={Pilot} durationInFrames={pilotDuration} fps={30} width={1280} height={720} />
  </>
);
