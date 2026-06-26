import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: ['.md'],
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatex],
		}),
	],
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true,
		}),
		prerender: {
			handleHttpError: ({ status, path }) => {
				if (status === 404) {
					console.warn(`[prerender] 404 ${path}`);
					return;
				}
			},
			handleMissingId: 'warn',
		},
	},
};

export default config;
