/// <reference types="@sveltejs/kit" />

export type GameState = {
	word?: string;
	state: 'waiting' | 'starting' | 'started' | 'finished';
	opponentWords: string[];
	players: string[];
	winner?: string;
};
