<script lang="ts">
	const word = 'COMMUNIST';
	const maxLetter = word.length;
	const maxGuesses = 6;

	const keyboard = ['AZERTYUIOP', 'QSDFGHJKLM', 'WXCVBN'];

	let inputWords = [];

	let currentWordInput = '';
	$: currentWord = currentWordInput.toUpperCase();
	$: usedLetters = inputWords.join().split('');
	$: validLetters = usedLetters.filter((l: string) => {
		return word.includes(l);
	});

	function handleKeydown(event) {
		let key = event.keyCode;
		if (key === 8) {
			// Backspace
			currentWordInput = currentWordInput.slice(0, -1);
		} else if (key === 13) {
			// Enter
			addWord();
		} else if (key >= 65 && key <= 90 && currentWordInput.length < maxLetter) {
			currentWordInput += event.key;
			console.log(event.key, key);
		}
	}

	function addWord() {
		if (currentWord.length === maxLetter && inputWords.length < 6) {
			inputWords = [...inputWords, currentWord];
			currentWordInput = '';
		}
	}

	function validLetter(letter, index) {
		return word[index] === letter;
	}

	function malformedLetter(letter, index) {
		return word.includes(letter) && word[index] !== letter;
	}
</script>

<svelte:window on:keydown="{handleKeydown}" />

<div class="flex flex-col justify-center items-centers max-w-2xl mx-auto mb-16">
	<h1 class="font-bold text-4xl md:text-5xl tracking-tight mb-4 text-white text-center">MOTUS</h1>
	<div class="mb-8 prose leading-6 text-gray-100 text-center">
		<div class="mt-20">
			{#each inputWords as row}
				<div class="flex w-[372px] justify-between mx-auto">
					{#each row as letter, index}
						<div
							class="text-3xl font-bold border bg-m-blue border-sky-500 px-2 py-1 w-[46.5px] h-[46.5px] flex items-center justify-center"
							class:bg-m-red="{validLetter(letter, index)}"
							class:bg-m-yellow="{malformedLetter(letter, index)}">{letter}</div
						>
					{/each}
				</div>
			{/each}
		</div>
		{#if inputWords.length < maxGuesses}
			<div class="flex w-[372px] justify-between mx-auto">
				{#each currentWord.padEnd(maxLetter, '.') as letter}
					<div
						class="text-3xl font-bold border bg-m-blue border-sky-500 px-2 py-1 w-[46.5px] h-[46.5px] flex items-center justify-center"
						>{letter}</div
					>
				{/each}
			</div>
		{/if}

		<div class="mt-20">
			{#each keyboard as row}
				<div class="flex justify-center gap-2 mb-2">
					{#each row as letter}
						<div
							class="border border-sky-500 px-2 py-1 w-[30px] h-[40px] leading-[30px] text-center"
							class:bg-m-red="{validLetters.includes(letter)}"
							class:bg-m-yellow="{usedLetters.includes(letter) && validLetters.includes(letter)}"
							class:opacity-25="{usedLetters.includes(letter) && !validLetters.includes(letter)}"
							>{letter}</div
						>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>
