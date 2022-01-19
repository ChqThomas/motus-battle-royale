<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ params, fetch, session, stuff }) {
		const url = `/api/get-word`;
		const res = await fetch(url);
		let body = await res.json();

		if (res.ok) {
			return {
				props: {
					word: body.word,
				},
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load ${url}`),
		};
	}
</script>

<script lang="ts">
	import Game from '$lib/components/Game.svelte';
	import Soundboard from '$lib/components/Soundboard.svelte';

	export let word;

	let sounds = [];

	function onAddWord(event) {
		sounds = event.detail.statuses;
	}

	function onWin() {
		sounds = ['winner'];
	}

	function onLose() {
		sounds = ['loser'];
	}
</script>

<main class="flex h-screen">
	<div class="m-auto">
		<Game word="{word}" on:addWord="{onAddWord}" on:win="{onWin}" on:lose="{onLose}" opponent="{false}" />
	</div>
</main>

<Soundboard sounds="{sounds}" />
