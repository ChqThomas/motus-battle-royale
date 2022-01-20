import { readable, writable } from 'svelte/store';
import type { Readable, Writable } from 'svelte/store';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { GameState } from '../global';
import type Player from '$lib/game/Player';
import type { SvelteComponent } from 'svelte';

export interface WritableResetable<T> extends Writable<T> {
	reset(): void;
}

function createGameState() {
	const defaultState: GameState = {
		word: '',
		players: [],
		winner: null,
		state: 'waiting',
		opponentWords: [],
	};
	const { subscribe, set, update } = writable(defaultState);

	return {
		subscribe,
		set,
		update,
		reset: () => set(defaultState),
	};
}

export const ws: Readable<Socket> = readable(
	io({
		autoConnect: false,
	}),
);
export const volume: Writable<number> = writable(20);
export const soundboard: Writable<typeof SvelteComponent> = writable(null);
export const player: Writable<Player> = writable({
	username: '',
	owner: false,
});

export const gameState: WritableResetable<GameState> = createGameState();
