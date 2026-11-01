import { Live } from './core.js';
import { mountAtlas } from './atlas/adapters/kym-live.js';
import { CHAPTER } from './atlas/biology/ch09-nerves-synapse-eye/chapter.js';

Live.register('atlas_ch09', (stage, params, api) => mountAtlas(stage, params, api, CHAPTER), {
  label: 'Explore in 3D Atlas',
  three: true,
});
