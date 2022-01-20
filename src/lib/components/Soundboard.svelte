<script lang="ts">
	import { volume } from '$lib/stores';

	let soundsCollection: Record<string, HTMLAudioElement> = {
		good: null,
		bad: null,
		wrong: null,
		winner: null,
		loser: null,
		bouleNoire: null,
	};

	export async function play(sounds: string[] = []): Promise<void> {
		await playPlaylist(sounds.map((item) => soundsCollection[item]));
	}

	async function playPlaylist(playlist): Promise<void> {
		for (const sound of playlist) {
			sound.volume = $volume / 100;
			sound.currentTime = 0;
			sound.play();
			await new Promise((r) => setTimeout(r, 250));
		}
	}
</script>

<audio bind:this="{soundsCollection.good}" src="/good.wav"></audio>
<audio bind:this="{soundsCollection.bad}" src="/bad.wav"></audio>
<audio bind:this="{soundsCollection.wrong}" src="/wrong.wav"></audio>
<audio bind:this="{soundsCollection.winner}" src="/winner.wav"></audio>
<audio bind:this="{soundsCollection.loser}" src="/loser.wav"></audio>
<audio bind:this="{soundsCollection.bouleNoire}" src="/boule-noire.wav"></audio>
