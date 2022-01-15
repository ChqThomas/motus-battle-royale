<script lang="ts">
	import Word from '$lib/components/Word.svelte';
	import Keyboard from '$lib/components/Keyboard.svelte';
	import { createEventDispatcher } from 'svelte';
	import { getWordStatuses } from '$lib/motus';
	const dispatch = createEventDispatcher();

	export let word = 'MOTUSVS';
	export let opponent = false;

	const maxLetter = word.length;
	const maxGuesses = 6;

	export let inputWords = [];

	let currentWordInput = '';
	$: currentWord = currentWordInput.toUpperCase();

	function handleKeydown(event) {
		if (opponent) {
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
		if (currentWord.length === maxLetter && inputWords.length < 6) {
			inputWords = [...inputWords, currentWord];
			dispatch('addWord', {
				word: currentWord,
				statuses: getWordStatuses(word, currentWord),
			});
			currentWordInput = '';
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
					{#each currentWord.padEnd(maxLetter, '.') as letter}
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
			<Keyboard words="{inputWords}" requiredWord="{word}" />
		{/if}
	</div>
</div>
