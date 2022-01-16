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
	import AnimatedTitle from '$lib/components/AnimatedTitle.svelte';

	export let word;

	word = 'BABOUINS';

	let sounds = [];

	function onAddWord(event) {
		sounds = event.detail.statuses;
	}
</script>

<main class="flex h-screen">
	<div class="m-auto">
		<h1 class="font-bold text-4xl md:text-5xl tracking-tight mb-4 text-white text-center mb-20">
			<a href="/">
				<AnimatedTitle title="MOTUS BATTLE ROYALE" />
			</a>
		</h1>
		<Soundboard sounds="{sounds}" />
		<Game word="{word}" on:addWord="{onAddWord}" opponent="{false}" />
	</div>
</main>
