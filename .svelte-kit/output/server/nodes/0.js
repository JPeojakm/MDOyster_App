import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.DjVklk4j.js","_app/immutable/chunks/disclose-version.C8nwLi83.js","_app/immutable/chunks/runtime.DqmpmPb3.js","_app/immutable/chunks/legacy.BB4qWT8z.js","_app/immutable/chunks/slot.5oa_PGP3.js"];
export const stylesheets = ["_app/immutable/assets/0.Blvlush4.css"];
export const fonts = [];
