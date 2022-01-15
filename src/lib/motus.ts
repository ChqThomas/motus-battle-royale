export function validLetter(word: string, letter: string, index: number): boolean {
	return word[index] === letter;
}

export function malformedLetter(word: string, letter: string, index: number): boolean {
	return word.includes(letter) && word[index] !== letter;
}

export function getLetterClass(word: string, letter: string, index: number): string {
	if (validLetter(word, letter, index)) {
		return 'bg-m-red';
	} else if (malformedLetter(word, letter, index)) {
		return 'bg-m-yellow';
	}
	return 'bg-m-blue';
}

export function getLetterClassKeyboard(word: string, words: string[], letter: string, index: number): string {
	words.join().split('');
	if (validLetter(word, letter, index)) {
		return 'bg-m-red';
	} else if (malformedLetter(word, letter, index)) {
		return 'bg-m-yellow';
	}
	return 'bg-m-blue';
}

export function getWordStatuses(requiredWord: string, word: string): string[] {
	return word.split('').map((letter, index) => {
		if (validLetter(requiredWord, letter, index)) {
			return 'good';
		} else if (malformedLetter(requiredWord, letter, index)) {
			return 'bad';
		}
		return 'wrong';
	});
}
