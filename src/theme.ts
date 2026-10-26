import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Placeholder until the channel name is chosen.
export const CHANNEL_NAME = 'WORLDWORKS';

export const C = {
  bg: '#0E1A2B',
  bg2: '#1A3150',
  ink: '#0A1220',
  parchment: '#F3E6C4',
  parchmentDim: '#C9BC9A',
  gold: '#F2B33D',
  goldDark: '#B07A17',
  silver: '#D5DCE3',
  copper: '#C46B3A',
  red: '#C8402F',
  redDark: '#8E2A1F',
  skin: '#E2A97E',
  leather: '#7A4A2A',
  steel: '#9AA7B4',
  steelDark: '#5F6C79',
  stone: '#8F8878',
  stoneDark: '#5E584C',
  green: '#7DB38A',
  greenDark: '#3F6E4C',
};

export const F = {
  display: 'Cinzel',
  body: 'Inter',
};

const fonts: Array<[string, string, string]> = [
  ['Cinzel', 'cinzel-latin-700-normal.woff2', '700'],
  ['Cinzel', 'cinzel-latin-900-normal.woff2', '900'],
  ['Inter', 'inter-latin-500-normal.woff2', '500'],
  ['Inter', 'inter-latin-700-normal.woff2', '700'],
  ['Inter', 'inter-latin-800-normal.woff2', '800'],
];

for (const [family, file, weight] of fonts) {
  loadFont({family, url: staticFile(`fonts/${file}`), weight});
}
