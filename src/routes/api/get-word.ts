import _ from 'lodash';
import words from '$lib/words';

/** @type {import('@sveltejs/kit').RequestHandler} */
export function get() {
	return {
		status: 200,
		body: { word: _.sample(words) },
	};
}
