/**
 * Une lettre est valide si elle est placée au bon endroit dans le mot recherché
 */
export function validLetter(wordToFind: string, letter: string, index: number): boolean {
	return wordToFind[index] === letter;
}

/**
 * Une lettre est invalide si elle existe dans le mot, qu'elle n'est pas placée au bon endroit,
 * qu'elle n'est pas déjà placée à un autre endroit
 */
export function malformedLetter(wordToFind: string, currentWord: string, index: number): boolean {
	const letter = currentWord[index];
	if (!wordToFind.includes(letter) || validLetter(wordToFind, letter, index)) {
		return false;
	}

	const alreadyPlaced = currentWord.slice(0, index + 1);
	const expectedCount = (wordToFind.match(new RegExp(letter, 'g')) || []).length;

	let placed = 0;
	let wellPlaced = 0;
	alreadyPlaced.split('').forEach((a, i) => {
		if (a === letter) {
			placed++;
		}
	});

	currentWord.split('').forEach((a, i) => {
		if (a === letter && validLetter(wordToFind, a, i)) {
			wellPlaced++;
		}
	});

	return placed <= expectedCount && wellPlaced < expectedCount;
}

export function getLetterClass(wordToFind: string, currentWord: string, letter: string, index: number): string {
	if (validLetter(wordToFind, letter, index)) {
		return 'bg-m-red';
	} else if (malformedLetter(wordToFind, currentWord, index)) {
		return 'bg-m-yellow';
	}
	return 'bg-m-blue';
}

export function getWordStatuses(wordToFind: string, word: string): string[] {
	return word.split('').map((letter, index) => {
		if (validLetter(wordToFind, letter, index)) {
			return 'good';
		} else if (malformedLetter(wordToFind, word, index)) {
			return 'bad';
		}
		return 'wrong';
	});
}
