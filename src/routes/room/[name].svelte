<style>
	.battle-grid {
		height: 100vh;
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: auto;
		overflow: hidden;
	}

	.battle-grid-left {
		align-self: center;
	}

	.battle-grid-right {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.battle-grid-right > * {
		align-self: center;
		display: flex;
		align-items: center;
	}
</style>

<script lang="ts">
	import { ws } from '$lib/stores';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	import Game from '$lib/components/Game.svelte';
	import SoundBoard from '$lib/components/Soundboard.svelte';
	import type { GameState } from '../../global';
	import { browser } from '$app/env';
	import _ from 'lodash';

	let sounds = [];
	let gameState: GameState = {
		word: '',
		players: [],
		winner: null,
		state: 'waiting',
		opponentWords: [],
	};

	let username = null;

	let opponents;

	let player;
	let opponentHeight = 0;
	let opponentScale = 0;

	$: {
		player = _.find(gameState.players, { username });
		opponents = gameState.players.filter((p) => p.username !== username);
		opponents.forEach((opponent, i) => {
			opponent.words = _.map(
				gameState.opponentWords.filter((ow) => ow.player === opponent.username),
				'word',
			);
			opponent.row = (i + 1) % 6;
		});
		if (browser) {
			let basicHeight = 450;
			opponentHeight = (document.body.clientHeight - 100) / Math.min(6, opponents.length);
			opponentScale = Math.min(0.75, opponentHeight / basicHeight);
		}
	}

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

	function startGame() {
		$ws.emit('start-game');
	}
</script>

<SoundBoard sounds="{sounds}" />

<div class="battle-grid">
	<div class="battle-grid-left">
		<h1 class="font-bold text-4xl md:text-5xl tracking-tight mb-8 text-white text-center"
			>Room {$page.params.name}</h1
		>
		{#if player}
			<div class="mb-4 prose leading-6 text-gray-100 text-center">
				Username: <span class="font-bold">{player.username}</span>
			</div>
			<div class="mb-4 prose leading-6 text-gray-100 text-center">Game status: {gameState.state}</div>
			{#if player.owner && gameState.state === 'waiting'}
				<button
					on:click="{startGame}"
					class="mb-8 bg-m-blue hover:bg-m-red text-white hover:text-black transition-colors font-bold py-2 px-4 rounded"
					>Démarrer la partie</button
				>
			{/if}
		{:else}
			<div class="mb-4 prose leading-6 text-gray-100 text-center"> Connexion en cours... </div>
		{/if}
		<Game word="{gameState.word}" state="{gameState.state}" on:addWord="{onAddWord}" />
	</div>
	<div class="battle-grid-right">
		{#each opponents as opponent, i}
			<div
				style="height: {100 /
					gameState.players.length}vh; transform: scale({opponentScale}); grid-row: {opponent.row}"
			>
				<Game
					word="{gameState.word}"
					opponent="{true}"
					opponentName="{opponent.username}"
					inputWords="{opponent.words}"
				/>
			</div>
		{/each}
	</div>
</div>
