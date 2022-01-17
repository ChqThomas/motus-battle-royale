<script lang="ts">
	import Word from '$lib/components/Word.svelte';
	import Keyboard from '$lib/components/Keyboard.svelte';
	import { createEventDispatcher } from 'svelte';
	import { blur } from 'svelte/transition';
	import { getWordStatuses } from '$lib/motus';
	import type { RoomState } from '../../global';
	const dispatch = createEventDispatcher();

	export let word = 'MOTUSVS';
	export let opponent = false;
	export let opponentName = '';
	export let state: RoomState | null = null;

	let maxLetter = word.length || 7;
	const maxGuesses = 6;

	export let inputWords = [];
	let inputWordsKeyboard = [];

	let currentWordInput = '';
	let displayed = word.length ? word[0] : '';
	let locked = true;
	$: currentWord = currentWordInput.toUpperCase();

	function start() {
		locked = false;
		displayed = word[0];
		maxLetter = word.length;
	}

	$: {
		if (word.length) {
			start();
		}
		if (state === 'finished') {
			setTimeout(function () {
				locked = true;
			}, maxLetter * 250);
		}
	}

	function handleKeydown(event) {
		if (opponent || locked) {
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
			locked = true;
			inputWords = [...inputWords, currentWord];
			let wordStatuses = getWordStatuses(word, currentWord);
			dispatch('addWord', {
				word: currentWord,
				statuses: wordStatuses,
			});
			currentWordInput = '';
			displayed = '';
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

		if (displayed === word) {
			displayed = '';
			locked = true;
			dispatch('win');
		} else {
			locked = false;
		}

		if (inputWords.length >= maxGuesses) {
			dispatch('lose');
		}

		inputWordsKeyboard = inputWords;
	}
</script>

<svelte:window on:keydown="{handleKeydown}" />

{#key 'game'}
	<div transition:blur class="flex flex-col justify-center items-centers max-w-2xl mx-auto">
		{#if opponentName}
			<h1 class="font-bold text-4xl md:text-4xl tracking-tight mb-4 text-white text-center">{opponentName}</h1>
		{/if}
		<div class="mb-8 prose leading-6 text-gray-100 text-center">
			<div>
				{#each inputWords as row}
					<Word on:displayed="{onWordDisplayed}" opponent="{opponent}" requiredWord="{word}" word="{row}" />
				{/each}
			</div>
			{#if inputWords.length < maxGuesses}
				{#each [...Array(maxGuesses - inputWords.length).keys()] as row, i}
					<div class="flex justify-center mx-auto">
						<!--				<Word opponent="{opponent}" requiredWord="{word}" word="{currentWord.padEnd(maxLetter, '.')}" />-->
						{#each i === 0 && currentWordInput === '' ? displayed.padEnd(maxLetter, '.') : currentWord.padEnd(maxLetter, '.') as letter}
							<div
								class="text-2xl font-bold border bg-m-blue border-sky-500 px-2 py-1 w-[50px] h-[50px] flex items-center justify-center"
							>
								{#if i === 0}{opponent ? '.' : locked ? '' : letter}{/if}</div
							>
						{/each}
					</div>
				{/each}
			{/if}

			{#if !opponent}
				<Keyboard words="{inputWordsKeyboard}" requiredWord="{word}" />
			{/if}
		</div>
	</div>
{/key}
