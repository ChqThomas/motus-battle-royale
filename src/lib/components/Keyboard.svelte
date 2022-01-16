<script lang="ts">
	import { validLetter } from '$lib/motus';

	export let requiredWord = '';
	export let words = [];

	const keyboard = ['AZERTYUIOP', 'QSDFGHJKLM', 'WXCVBN'];

	let rows, usedLetters, goodLetters;

	$: {
		usedLetters = words.join().split('');
		goodLetters = usedLetters.filter((l: string) => {
			return requiredWord.includes(l);
		});
		rows = keyboard.map((k) => {
			return k.split('').map((l) => {
				return {
					char: l,
					className: getClass(l),
				};
			});
		});
	}

	function getClass(letter) {
		// Si un des mots contient la lettre bien placée
		let good = false;
		words.forEach((w) => {
			w.split('').forEach((l, index) => {
				if (l === letter && validLetter(requiredWord, l, index)) {
					good = true;
				}
			});
		});

		if (good) {
			return 'bg-m-red';
		}

		// Si le mot cherché contient la lettre et qu'elle a déjà été tapée
		if (requiredWord.includes(letter) && words.join('').split('').includes(letter)) {
			return 'bg-m-yellow';
		}

		// Si le mot cherché ne contient pas la lettre et qu'elle a déjà été tapée
		if (!requiredWord.includes(letter) && words.join('').split('').includes(letter)) {
			return 'opacity-25 bg-m-blue';
		}

		return 'bg-m-blue';
	}
</script>

<div class="mt-20">
	{#each rows as row}
		<div class="flex justify-center gap-2 mb-2">
			{#each row as letter}
				<div
					class="px-2 py-1 w-[30px] h-[40px] leading-[30px] text-center transition duration-500 {letter.className}"
					>{letter.char}</div
				>
			{/each}
		</div>
	{/each}
</div>
