import adapter from '@sveltejs/adapter-vercel';

export default {
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				console.warn(`404 error on ${path}, referrer: ${referrer}`);
				// 忽略 404 错误，继续构建
				return;
			}
		}
	}
};
