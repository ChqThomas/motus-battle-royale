<script lang="ts">
	import { ws } from '$lib/stores';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import Game from '$lib/components/Game.svelte';
	import SoundBoard from '$lib/components/Soundboard.svelte';
	import type { GameState } from '../../global';

	let sounds = [];
	let gameState: GameState = {
		word: '',
		players: [],
		winner: null,
		state: 'waiting',
		opponentWords: [],
	};

	let username = null;

	onMount(() => {
		$ws.on('set-user', (player) => {
			username = player.username;
		});

		$ws.emit('join-request', { room: $page.params.name });

		$ws.on('update-game-state', (state: GameState) => {
			gameState = { ...gameState, ...state };
		});
	});

	function onAddWord(event) {
		$ws.emit('new-word', { word: event.detail.word });
		sounds = event.detail.statuses;
	}
</script>

<SoundBoard sounds="{sounds}" />

<div class="flex flex-col justify-center items-centers max-w-2xl mx-auto mb-16">
	<h1 class="font-bold text-4xl md:text-5xl tracking-tight mb-4 text-white text-center">Room {$page.params.name}</h1>
	<div class="mb-8 prose leading-6 text-gray-100 text-center">Game status: {gameState.state}</div>
	<div class="mb-8 prose leading-6 text-gray-100 text-center"
		>Players: <ul
			>{#each gameState.players as player}
				<li
					>{player}
					{#if username === player} (VOUS){/if}</li
				>
			{/each}</ul
		></div
	>
</div>
{#if gameState.state === 'started'}
	<div class="grid-container grid grid-cols-4">
		<div class="col-span-3">
			<Game word="{gameState.word}" on:addWord="{onAddWord}" />
		</div>
		<div class="col-span-1 scale-75">
			<Game word="{gameState.word}" opponent="true" inputWords="{gameState.opponentWords}" />
		</div>
	</div>
{/if}
