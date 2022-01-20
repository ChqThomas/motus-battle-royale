<style>
	.battle-grid {
		height: calc(100vh - 80px);
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: auto;
		overflow: hidden;
	}

	.battle-grid-left {
		align-self: center;
		@apply border-r-2 border-gray-600;
	}

	.battle-grid-right {
		display: grid;
		grid-template-columns: auto;
	}

	.battle-grid-right > * {
		align-self: center;
		display: flex;
		align-items: center;
	}
</style>

<script lang="ts">
	import { ws, gameState, player, soundboard } from '$lib/stores';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { blur } from 'svelte/transition';

	import Countdown from '$lib/components/Countdown.svelte';
	import Game from '$lib/components/Game.svelte';
	import type { GameState } from '../../global';
	import { browser } from '$app/env';
	import _ from 'lodash';

	let username = null;
	let gameComponent: Game;
	let opponentGameComponents: Game[] = [];

	let opponents;

	let opponentHeight = 0;
	let opponentScale = 0;
	let prevGameState = $gameState;

	$: {
		$player = _.find($gameState.players, { username });
		opponents = $gameState.players.filter((p) => p.username !== username);
		opponents.forEach((opponent, i) => {
			opponent.words = _.map(
				$gameState.opponentWords.filter((ow) => ow.player === opponent.username),
				'word',
			);
			opponent.row = (i + 1) % 6;
		});
		if (browser && document.querySelector('.battle-grid')) {
			let basicHeight = 450;
			let opH = (document.body.clientHeight - 100) / Math.min(6, opponents.length);
			let gridHeight = document.querySelector('.battle-grid').clientHeight;
			opponentHeight = (gridHeight - 100) / Math.min(6, opponents.length) - 25;
			opponentScale = Math.min(0.75, opH / basicHeight);
		}
	}

	onMount(() => {
		$ws.connect();
		$ws.on('connect', () => {
			$ws.emit('join-request', { room: $page.params.name });

			$ws.on('set-user', (player) => {
				username = player.username;
			});

			$ws.on('update-game-state', (state: GameState) => {
				$gameState = { ...$gameState, ...state };

				if ($gameState.state !== prevGameState.state && $gameState.state === 'waiting') {
					gameComponent.reset();
					for (const opponent of opponentGameComponents) {
						opponent.reset();
					}
				}

				prevGameState = $gameState;
			});
		});

		$ws.on('disconnect', () => {
			$ws.removeAllListeners();
		});
	});

	onDestroy(() => {
		$ws.disconnect();
		gameState.reset();
	});

	function onAddWord(event) {
		$ws.emit('new-word', { word: event.detail.word });
		$soundboard.play(event.detail.statuses);
	}

	function startGame() {
		$ws.emit('start-game');
	}

	function resetGame() {
		$ws.emit('reset-game');
	}

	function onWin() {
		$soundboard.play(['winner']);
	}

	function onLose() {
		$soundboard.play(['loser']);
	}

	function onOpponentWin() {
		$soundboard.play(['bouleNoire']);
	}
</script>

<div class="battle-grid">
	<div class="battle-grid-left">
		<div class="h-[150px]">
			{#if $player}
				{#if $gameState.state === 'waiting'}
					{#if $player.owner}
						<button
							in:blur
							on:click="{startGame}"
							class="mb-8 bg-m-blue hover:bg-m-red text-white hover:text-black transition-colors font-bold py-2 px-4 rounded"
							>Démarrer la partie</button
						>
					{:else}
						<button
							in:blur
							type="button"
							class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-m-blue hover:bg-m-blue transition ease-in-out duration-150 cursor-not-allowed"
							disabled=""
						>
							<svg
								class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							En attente du lancement de la partie
						</button>
					{/if}
				{/if}
				{#if $gameState.state === 'starting'}
					<div in:blur="{{ duration: 300 }}" out:blur="{{ duration: 500, delay: 250 }}">
						<Countdown countdown="{3}" />
					</div>
				{/if}
				{#if $gameState.state === 'finished'}
					<div in:blur="{{ duration: 150, delay: $gameState.word.length * 250 }}">
						<div class="mb-5">
							Partie terminée ! Le mot était <span class="font-bold text-xl">{$gameState.word}</span>
						</div>
						<div class="mb-5">
							{#if $gameState.winner === $player.username}
								🏆 Bravo ! vous être le vainqueur !
							{:else}
								Perdu ! <span class="font-bold">{$gameState.winner}</span> remporte la partie !
							{/if}
						</div>
						{#if $player.owner}
							<div>
								<button
									in:blur
									on:click="{resetGame}"
									class="mb-8 bg-m-blue hover:bg-m-red text-white hover:text-black transition-colors font-bold py-2 px-4 rounded"
									>Relancer une partie</button
								>
							</div>
						{/if}
					</div>
				{/if}
			{/if}
		</div>

		<Game
			bind:this="{gameComponent}"
			word="{$gameState.word}"
			state="{$gameState.state}"
			on:win="{onWin}"
			on:lose="{onLose}"
			on:addWord="{onAddWord}"
		/>
	</div>
	<div class="battle-grid-right">
		{#if opponents.length}
			{#each opponents as opponent, i}
				<div style="height: {opponentHeight}px; transform: scale({opponentScale}); grid-row: {opponent.row}">
					<Game
						bind:this="{opponentGameComponents[i]}"
						word="{$gameState.word}"
						opponent="{true}"
						opponentName="{opponent.username}"
						inputWords="{opponent.words}"
						on:win="{onOpponentWin}"
					/>
				</div>
			{/each}
		{:else if $gameState.state === 'waiting'}
			<div class="text-xl mx-auto">En attente d'aversaires...</div>
		{/if}
	</div>
</div>
