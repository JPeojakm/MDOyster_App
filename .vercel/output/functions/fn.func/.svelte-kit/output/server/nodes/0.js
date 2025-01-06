import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.BHVdF3fh.js","_app/immutable/chunks/disclose-version.CRUpb_ih.js","_app/immutable/chunks/runtime.DqmpmPb3.js","_app/immutable/chunks/legacy.BB4qWT8z.js","_app/immutable/chunks/slot.5oa_PGP3.js"];
export const stylesheets = ["_app/immutable/assets/0.B4BsYxiR.css"];
export const fonts = [];
