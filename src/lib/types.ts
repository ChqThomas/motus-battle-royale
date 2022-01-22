import type Player from '$lib/game/Player';
import type { PlayerWord, RoomState } from '$lib/game/Room';

export type GameState = {
	word?: string;
	state?: RoomState;
	playerWords?: PlayerWord[];
	players?: Player[];
	winner?: Player;
};
