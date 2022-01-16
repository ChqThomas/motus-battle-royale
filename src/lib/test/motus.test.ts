import { expect, test } from 'vitest';
import { validLetter, malformedLetter } from '../motus';

test('validLetter should work as expected', () => {
	expect(validLetter('BANANES', 'B', 0)).toBe(true);
	expect(validLetter('BANANES', 'A', 1)).toBe(true);
	expect(validLetter('BANANES', 'N', 2)).toBe(true);
	expect(validLetter('BANANES', 'A', 3)).toBe(true);
	expect(validLetter('BANANES', 'N', 1)).toBe(false);
	expect(validLetter('BANANES', 'Z', 1)).toBe(false);
});

test('malformedLetter should work as expected', () => {
	expect(
		malformedLetter('BANANES', 'BRETONS', 0),
		"Lettre bien placée dans un mot qui ne la contient qu'une seule fois",
	).toBe(false);
	expect(
		malformedLetter('BANANES', 'BARBARE', 0),
		'1ere apparition de lettre bien placée dans un mot qui la contient 2 fois',
	).toBe(false);
	expect(
		malformedLetter('BANANES', 'ABRICOT', 1),
		'Lettre mal placée dans un mot qui la contient une seule fois',
	).toBe(true);
	expect(
		malformedLetter('BANANES', 'ANIMAUX', 0),
		'Lettre mal placée dans un mot qui la contient plusieurs fois',
	).toBe(true);
	expect(malformedLetter('BANANES', 'ZZZZZZZ', 0), "Lettre qui n'existe pas dans le mot").toBe(false);
	expect(
		malformedLetter('BABOUINS', 'BARBARE', 3),
		'2eme apparition de lettre mal placée dans un mot qui la contient 2 fois (1ere bien placée)',
	).toBe(true);
	expect(
		malformedLetter('BABOUINS', 'EBARBAR', 4),
		'2eme apparition de lettre mal placée dans un mot qui la contient plusieurs fois (toutes mal placées)',
	).toBe(true);
	expect(
		malformedLetter('BABOUINS', 'ABBOUIN', 2),
		'2eme apparition de lettre mal placée dans un mot qui la contient plusieurs fois (1ere mal placée)',
	).toBe(false);
	expect(
		malformedLetter('BABOUINS', 'EBARBAB', 6),
		'3eme apparition de lettre dans un mot qui la contient 2 fois',
	).toBe(false);
	expect(
		malformedLetter('BABOUINS', 'BOOOOOO', 1),
		'Lettre mal placée dans un mot ou elle est déjà bien placée après celle-ci',
	).toBe(false);
	expect(
		malformedLetter('BABOUINS', 'BABOOOO', 6),
		'Lettre mal placée dans un mot ou elle est déjà bien placée avant celle-ci',
	).toBe(false);
});
