<script lang="ts">
	import Word from '$lib/components/Word.svelte';
	import Keyboard from '$lib/components/Keyboard.svelte';
	import { createEventDispatcher } from 'svelte';
	import { getWordStatuses, validLetter } from '$lib/motus';
	import _ from 'lodash';
	const dispatch = createEventDispatcher();

	export let word = 'MOTUSVS';
	export let opponent = false;

	const maxLetter = word.length;
	const maxGuesses = 6;

	export let inputWords = [];
	let inputWordsKeyboard = [];

	let currentWordInput = '';
	let displayed = word[0];
	let locked = false;
	$: currentWord = currentWordInput.toUpperCase();

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
			setTimeout(function () {
				let allStatuses = inputWords.map((w) => {
					return getWordStatuses(word, w);
				});

				word.split('').forEach((letter, index) => {
					displayed += allStatuses.map((s) => s[index]).some((s) => s === 'good') ? letter : '.';
				});

				locked = false;
				inputWordsKeyboard = inputWords;
			}, 350 * maxLetter);
		}
	}
</script>

<svelte:window on:keydown="{handleKeydown}" />

<div class="flex flex-col justify-center items-centers max-w-2xl mx-auto mb-16">
	<h1 class="font-bold text-4xl md:text-5xl tracking-tight mb-4 text-white text-center">
		{#if opponent}Adversaire{:else}MOTUS VS{/if}
	</h1>
	<div class="mb-8 prose leading-6 text-gray-100 text-center">
		<div class="mt-20">
			{#each inputWords as row}
				<Word opponent="{opponent}" requiredWord="{word}" word="{row}" />
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
							{#if i === 0}{opponent ? '.' : letter}{/if}</div
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
