<script lang="ts">
	import { browser } from '$app/env';
	import { afterUpdate } from 'svelte';

	let good, bad, wrong;

	export let sounds = [];
	let playlist = [];
	let audioPointer = 0;
	let audio;

	function play() {
		playlist = [];
		audioPointer = 0;
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
			}
		});
		playNext();
	}

	function playNext() {
		if (audioPointer < playlist.length) {
			audio = playlist[audioPointer];
			audio.addEventListener('ended', playNext);
			audio.play();
			audioPointer += 1;
		}
	}

	if (browser) {
		afterUpdate(play);
	}
</script>

<audio bind:this="{good}" src="/good.wav"></audio>
<audio bind:this="{bad}" src="/bad.wav"></audio>
<audio bind:this="{wrong}" src="/wrong.wav"></audio>
