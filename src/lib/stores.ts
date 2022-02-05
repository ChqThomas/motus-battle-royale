import { readable, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type Player from '$lib/game/Player';
import type { SvelteComponent } from 'svelte';
import type { ServerToClientEvents, ClientToServerEvents } from '$lib/websockets';
import type { GameState } from '$lib/types';

export interface WritableResetable<T> extends Writable<T> {
	reset(): void;
}

function createGameState() {
	const defaultState: GameState = {
		word: '',
		players: [],
		winner: null,
		state: 'waiting',
		options: {
			maxHealth: 3,
			maxGuesses: 6,
		},
		ended: false,
	};
	const { subscribe, set, update } = writable(defaultState);

	return {
		subscribe,
		set,
		update,
		reset: () => set(defaultState),
	};
}

const socketQuery: { username?: string } = {};
if (typeof localStorage !== 'undefined' && 'username' in localStorage) {
	socketQuery.username = localStorage.username;
}

export const ws: Readable<Socket> = readable(
	io({
		autoConnect: false,
		query: socketQuery,
	}),
);

let volumeValue = 20;
if (typeof localStorage !== 'undefined' && 'volume' in localStorage) {
	volumeValue = localStorage.volume;
}

export const volume: Writable<number> = writable(volumeValue);
export const soundboard: Writable<typeof SvelteComponent> = writable(null);
export const player: Writable<Player> = writable({
	id: null,
	username: '',
	owner: false,
	words: [],
	health: 3,
});

export const gameState: WritableResetable<GameState> = createGameState();
export const modal: Writable<any> = writable(null);
