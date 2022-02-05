<style>
	.battle-grid {
		height: calc(100vh - 80px);
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: auto;
		overflow: hidden;
	}

	.battle-grid-left {
		margin-top: 90px;
		align-self: center;
		@apply border-r-2 border-gray-600;
	}

	.battle-grid-right {
		margin-top: 90px;
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
	import { ws, gameState, player, soundboard, modal } from '$lib/stores';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { blur } from 'svelte/transition';

	import Countdown from '$lib/components/Countdown.svelte';
	import Game from '$lib/components/Game.svelte';
	import Typewriter from 'svelte-typewriter';
	import type { GameState } from '$lib/types';
	import { browser } from '$app/env';
	import _ from 'lodash';

	let userId = null;
	let gameComponent: Game;
	let opponentGameComponents: Game[] = [];

	let opponents;

	let opponentHeight = 0;
	let opponentScale = 0;
	let prevGameState = $gameState;
	let invalidWord = null;
	let ended = false;
	let gridHeight = 0;

	$: {
		$player = _.find($gameState.players, { id: userId });
		opponents = $gameState.players.filter((p) => p.id !== userId);
		opponents.forEach((opponent, i) => {
			opponent.row = (i + 1) % 6;
		});
		ended = $gameState ? $gameState.ended : false;
		if (browser && document.querySelector('.battle-grid')) {
			let basicHeight = 450;
			let opH = (document.body.clientHeight - 100) / Math.min(6, opponents.length);
			opponentHeight = (gridHeight - 100) / Math.min(6, opponents.length) - 25;
			opponentScale = Math.min(0.75, opH / basicHeight);
		}
	}

	onMount(() => {
		$ws.connect();
		$ws.on('connect', () => {
			$ws.emit('join-request', { room: $page.params.name }, (response) => {
				if (response.joined) {
					$gameState.options = response.options;
				}
			});
		});

		$ws.on('disconnect', () => {
			$ws.removeAllListeners();
		});

		$ws.on('set-user', (player) => {
			userId = player.id;
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

	onDestroy(() => {
		$ws.disconnect();
		gameState.reset();
	});

	function onAddWord(event) {
		$soundboard.play(event.detail.statuses);
	}

	async function onInvalidWord(event) {
		invalidWord = event.detail.word;
		$soundboard.play(['wrong']);
		await new Promise((r) => setTimeout(r, 1000));
		invalidWord = null;
	}

	function startGame() {
		$ws.emit('start-game');
	}

	function resetGame() {
		$ws.emit('reset-game');
	}

	function resetRound() {
		$ws.emit('reset-round');
	}

	function giveUp() {
		$ws.emit('give-up');
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

<div class="battle-grid" bind:clientHeight="{gridHeight}">
	<div class="battle-grid-left">
		<div class="h-[200px] px-5 mb-3 flex flex-col justify-end">
			{#if $player}
				{#if $gameState.state === 'waiting'}
					{#if $player.owner}
						<button
							in:blur
							on:click="{startGame}"
							class="self-center bg-m-blue hover:bg-m-red text-white hover:text-black transition-colors font-bold py-2 px-4 rounded"
							>Démarrer la partie</button
						>
					{:else}
						<button
							in:blur
							type="button"
							class="self-center inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-m-blue hover:bg-m-blue transition ease-in-out duration-150 cursor-not-allowed"
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
							En attente du lancement
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
							{ended === true ? 'Partie terminée' : 'Round terminé'} ! Le mot était
							<span class="font-bold text-xl">{$gameState.word}</span>
						</div>
						{#if $gameState.winner}
							<div class="mb-5">
								{#if $gameState.winner.id === $player.id}
									🏆 Bravo ! vous remportez {$gameState.ended === true ? 'la partie' : 'le round'} !
								{:else}
									Perdu ! <span class="font-bold">{$gameState.winner.username}</span> remporte {ended ===
									true
										? 'la partie'
										: 'le round'}
									!
								{/if}
							</div>
						{:else}
							<div class="mb-5">Il n'y a pas de gagnant !</div>
						{/if}
						{#if $gameState.definition}
							{#key $gameState.definition.id}
								<div class="mb-5">
									<Typewriter cascade interval="{20}" delay="{$gameState.word.length * 250}"
										><a
											class="text-m-yellow"
											target="_blank"
											href="{$gameState.definition.dicolinkUrl}">Définition</a
										>
										: <span>{$gameState.definition.definition}</span></Typewriter
									></div
								>
							{/key}
						{/if}
						{#if $player.owner}
							<div>
								<button
									in:blur
									on:click="{resetGame}"
									class="bg-m-blue hover:bg-m-red text-white hover:text-black transition-colors font-bold py-2 px-4 rounded"
									>Relancer une partie</button
								>
								{#if ended === false}
									<button
										in:blur
										on:click="{resetRound}"
										class="bg-m-blue hover:bg-m-red text-white hover:text-black transition-colors font-bold py-2 px-4 rounded"
										>Prochain round</button
									>
								{/if}
							</div>
						{/if}
					</div>
				{/if}
				{#if $gameState.state === 'started'}
					{#if invalidWord !== null}
						<div out:blur class="text-xl"
							>Le mot <span class="font-bold">{invalidWord}</span> n'existe pas dans notre dictionnaire !</div
						>
					{/if}
				{/if}
			{/if}
		</div>

		<Game
			bind:this="{gameComponent}"
			word="{$gameState.word}"
			state="{$gameState.state}"
			options="{$gameState.options}"
			player="{$player}"
			on:win="{onWin}"
			on:lose="{onLose}"
			on:addWord="{onAddWord}"
			on:invalidWord="{onInvalidWord}"
		/>
	</div>
	<div class="battle-grid-right">
		{#if opponents.length}
			{#each opponents as opponent, i}
				{#key opponent.id}
					<div
						style="height: {opponentHeight}px; transform: scale({opponentScale}); grid-row: {opponent.row}"
					>
						<Game
							bind:this="{opponentGameComponents[i]}"
							word="{$gameState.word}"
							options="{$gameState.options}"
							opponent="{true}"
							player="{opponent}"
							inputWords="{opponent.words}"
							on:win="{onOpponentWin}"
						/>
					</div>
				{/key}
			{/each}
		{:else if $gameState.state === 'waiting'}
			<div class="text-xl mx-auto">En attente d'aversaires...</div>
		{/if}
	</div>
</div>
