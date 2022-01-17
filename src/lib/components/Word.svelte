<script lang="ts">
	import { onMount } from 'svelte';
	import { getLetterClass } from '$lib/motus';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let opponent = false;
	export let requiredWord = '';
	export let word = '';

	let letters = [];

	async function update() {
		letters = word.split('').map((letter: string, index: number) => {
			return {
				char: letter,
				index,
				className: 'bg-m-blue',
				subClassName: '',
			};
		});

		for (const [index, letter] of letters.entries()) {
			await new Promise((r) => setTimeout(r, 250));
			letters[index].subClassName = 'text-pop-up-top';
			letters[index].className = getLetterClass(requiredWord, word, letter.char, letter.index);
		}
		dispatch('displayed');
	}

	onMount(update);
</script>

<div class="flex justify-center mx-auto">
	{#each letters as letter}
		<div
			class="text-2xl font-bold border border-sky-500 px-2 py-1 w-[50px] h-[50px] flex items-center justify-center {letter.className}"
		>
			<span class="{letter.subClassName}">{opponent ? '*' : letter.char}</span></div
		>
	{/each}
</div>
