<script lang="ts">
	import Word from '$lib/components/Word.svelte';
	import Keyboard from '$lib/components/Keyboard.svelte';
	import HealthBar from '$lib/components/HealthBar.svelte';
	import { createEventDispatcher } from 'svelte';
	import { blur } from 'svelte/transition';
	import { getWordStatuses } from '$lib/motus';
	import { ws } from '$lib/stores';
	import type { RoomOption, RoomState } from '$lib/game/Room';
	const dispatch = createEventDispatcher();

	export let word = 'MOTUSVS';
	export let opponent = false;
	export let player;
	export let options: RoomOption;
	export let state: RoomState | null = null;

	let maxLetter = word.length || 7;
	let maxGuesses = 6;

	export let inputWords = [];
	let inputWordsKeyboard = [];

	let currentWordInput = '';
	let displayed = word.length ? word[0] : '';
	let locked = true;
	let lose = false;
	let size = 50;
	let sizeStyle;
	$: currentWord = currentWordInput.toUpperCase();
	$: size = Math.min(50, 300 / options.maxGuesses);
	$: sizeStyle = `width: 50px; height: ${size}px`;

	function start() {
		locked = false;
		displayed = word[0];
		maxLetter = word.length;
	}

	$: {
		lose = player && player.health === 0;
		maxGuesses = options.maxGuesses;
		if (word.length) {
			start();
		}
		if (state === 'finished' && !lose) {
			setTimeout(function () {
				locked = true;
			}, maxLetter * 250);
		}
	}

	function handleKeydown(event) {
		if (opponent || locked || lose) {
			return false;
		}
		let key = event.keyCode;
		if (key === 8) {
			// Backspace
			currentWordInput = currentWordInput.slice(0, -1);
		} else if (key === 13) {
			// Enter
			addWord();
		} else if (key >= 65 && key <= 90 && currentWordInput.length < maxLetter) {
			currentWordInput += event.key;
		}
	}

	function addWord() {
		if (currentWord.length === maxLetter && inputWords.length < maxGuesses) {
			$ws.emit('new-word', { word: currentWord }, ({ valid }) => {
				if (valid) {
					locked = true;
					inputWords = [...inputWords, currentWord];
					let wordStatuses = getWordStatuses(word, currentWord);
					dispatch('addWord', {
						word: currentWord,
						statuses: wordStatuses,
					});
					currentWordInput = '';
					displayed = '';
				} else {
					dispatch('invalidWord', {
						word: currentWord,
					});
				}
			});
		}
	}

	function onWordDisplayed() {
		let allStatuses = inputWords.map((w) => {
			return getWordStatuses(word, w);
		});

		displayed = '';
		word.split('').forEach((letter, index) => {
			displayed += allStatuses.map((s) => s[index]).some((s) => s === 'good') ? letter : '.';
		});

		let win = false;
		if (displayed === word) {
			displayed = '';
			locked = true;
			dispatch('win');
			win = true;
		} else {
			locked = false;
		}

		if (!win && !inputWords.length >= maxGuesses) {
			dispatch('lose');
		}

		inputWordsKeyboard = inputWords;
	}

	export function reset(): void {
		inputWords = [];
		inputWordsKeyboard = [];
		displayed = '';
		currentWordInput = '';
		locked = true;
	}
</script>

<svelte:window on:keydown="{handleKeydown}" />

{#key 'game'}
	<div
		transition:blur
		class="flex flex-col justify-center items-centers max-w-2xl mx-auto {lose ? 'game-lose-state' : ''}"
	>
		{#if opponent}
			<h1 class="font-bold text-4xl md:text-4xl tracking-tight mb-4 text-white text-center">
				{#if options.maxHealth > 1}
					<span class="text-xl mr-2">
						<HealthBar options="{options}" player="{player}" />
					</span>
				{/if}
				{player.username}
			</h1>
		{/if}
		<div class="mb-8 prose leading-6 text-gray-100 text-center">
			<div>
				{#each inputWords as row}
					<Word
						on:displayed="{onWordDisplayed}"
						opponent="{opponent}"
						requiredWord="{word}"
						word="{row}"
						size="{size}"
					/>
				{/each}
			</div>
			{#if inputWords.length < maxGuesses}
				{#each [...Array(maxGuesses - inputWords.length).keys()] as row, i}
					<div class="flex justify-center mx-auto">
						<!--				<Word opponent="{opponent}" requiredWord="{word}" word="{currentWord.padEnd(maxLetter, '.')}" />-->
						{#each i === 0 && currentWordInput === '' ? displayed.padEnd(maxLetter, '.') : currentWord.padEnd(maxLetter, '.') as letter}
							<div
								style="{sizeStyle}"
								class="text-2xl font-bold border bg-m-blue border-sky-500 px-2 py-1 flex items-center justify-center"
							>
								{#if i === 0}{opponent ? '.' : locked ? '' : letter}{/if}</div
							>
						{/each}
					</div>
				{/each}
			{/if}

			{#if !opponent}
				{#if player && options.maxHealth > 1}
					<div class="text-xl mt-8">
						<HealthBar options="{options}" player="{player}" />
					</div>
				{/if}
				<div class="{options.maxHealth > 1 ? 'mt-10' : 'mt-20'}">
					<Keyboard words="{inputWordsKeyboard}" requiredWord="{word}" />
				</div>
			{/if}
		</div>
	</div>
{/key}
