<script lang="ts">
	import { browser } from '$app/env';
	import { afterUpdate } from 'svelte';
	import { volume } from '$lib/stores';

	let good, bad, wrong, winner, loser, bouleNoire;

	export let sounds = [];

	async function play(sounds) {
		let playlist: HTMLAudioElement[] = [];
		sounds.forEach((item) => {
			switch (item) {
				case 'good':
					playlist.push(good);
					break;
				case 'bad':
					playlist.push(bad);
					break;
				case 'wrong':
					playlist.push(wrong);
					break;
				case 'winner':
					playlist.push(winner);
					break;
				case 'loser':
					playlist.push(loser);
					break;
				case 'bouleNoire':
					playlist.push(bouleNoire);
					break;
			}
		});
		await playPlaylist(playlist);
	}

	async function playPlaylist(playlist) {
		for (const sound of playlist) {
			sound.volume = $volume / 100;
			sound.currentTime = 0;
			sound.play();
			await new Promise((r) => setTimeout(r, 250));
		}
	}

	if (browser) {
		afterUpdate(async () => {
			const playlist = sounds;
			sounds = [];
			await play(playlist);
		});
	}
</script>

<audio bind:this="{good}" src="/good.wav"></audio>
<audio bind:this="{bad}" src="/bad.wav"></audio>
<audio bind:this="{wrong}" src="/wrong.wav"></audio>
<audio bind:this="{winner}" src="/winner.wav"></audio>
<audio bind:this="{loser}" src="/loser.wav"></audio>
<audio bind:this="{bouleNoire}" src="/boule-noire.wav"></audio>
