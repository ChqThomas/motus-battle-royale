/// <reference types="@sveltejs/kit" />

export type RoomState = 'waiting' | 'starting' | 'started' | 'finished';
export type GameState = {
	word?: string;
	state: RoomState;
	opponentWords: string[];
	players: string[];
	winner?: string;
};
