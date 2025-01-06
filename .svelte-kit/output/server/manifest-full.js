export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","_img/.DS_Store","_img/baltimore_oyster.jpg","_img/map-0.png","_img/map-1.png","_img/map-2.png","_img/map-3.png","_img/oyster_frontpage.jpg","_img/warm.png","favicon.png","oyster_emoji.png"]),
	mimeTypes: {".jpg":"image/jpeg",".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.DgBCwJ3K.js","app":"_app/immutable/entry/app.BnBPBy-z.js","imports":["_app/immutable/entry/start.DgBCwJ3K.js","_app/immutable/chunks/entry.VytFzTa2.js","_app/immutable/chunks/runtime.DqmpmPb3.js","_app/immutable/chunks/index.DxKvfsxG.js","_app/immutable/chunks/index-client.BDSm6-kq.js","_app/immutable/entry/app.BnBPBy-z.js","_app/immutable/chunks/runtime.DqmpmPb3.js","_app/immutable/chunks/render.vRbh2nuK.js","_app/immutable/chunks/disclose-version.C8nwLi83.js","_app/immutable/chunks/props.CpECA-PO.js","_app/immutable/chunks/index-client.BDSm6-kq.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
