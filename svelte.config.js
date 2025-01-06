import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// 如果你希望支持单页面应用 (SPA)，使用 fallback 文件，如 app.html
			fallback: 'app.html'
		}),
		paths: {
			// 如果你的应用部署在子路径（如 https://username.github.io/repo-name），需要设置 base 路径
			// 对于 Vercel 部署在根路径，注释掉以下行
			// base: '/your-repo-name'
		}
	}
};

export default config;
