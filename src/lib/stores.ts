import { readable, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { GameState } from '../global';
import type Player from '$lib/game/Player';

export const ws: Readable<Socket> = readable(
	io({
		autoConnect: false,
	}),
);
export const volume: Writable<number> = writable(20);
export const player: Writable<Player> = writable({
	username: '',
	owner: false,
});
export const gameState: Writable<GameState> = writable({
	word: '',
	players: [],
	winner: null,
	state: 'waiting',
	opponentWords: [],
});
