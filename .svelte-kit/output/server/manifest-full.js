export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["_img/baltimore_oyster.jpg","_img/map-1.png","_img/map-2.png","_img/map-3.png","_img/oyster_frontpage.jpg","favicon.png","oyster_emoji.png"]),
	mimeTypes: {".jpg":"image/jpeg",".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.CgcHCXQi.js","app":"_app/immutable/entry/app.D2c1BtL2.js","imports":["_app/immutable/entry/start.CgcHCXQi.js","_app/immutable/chunks/entry.B7NIKJbX.js","_app/immutable/chunks/runtime.DqmpmPb3.js","_app/immutable/chunks/index.DxKvfsxG.js","_app/immutable/chunks/index-client.BDSm6-kq.js","_app/immutable/entry/app.D2c1BtL2.js","_app/immutable/chunks/runtime.DqmpmPb3.js","_app/immutable/chunks/render.CiHwMsEe.js","_app/immutable/chunks/disclose-version.CRUpb_ih.js","_app/immutable/chunks/props.CpECA-PO.js","_app/immutable/chunks/index-client.BDSm6-kq.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
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
