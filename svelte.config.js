import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import { Server } from 'socket.io';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [preprocess({})],
	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			plugins: [
				{
					name: 'websockets',
					configureServer(server) {
						import('./dist/websockets.js').then(({ default: initWebsockets }) => {
							initWebsockets(new Server(server.httpServer));
						});
					},
				},
			],
		},
	},
};

export default config;
