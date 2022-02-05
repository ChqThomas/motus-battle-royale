import type Player from '$lib/game/Player';
import type { RoomState, RoomOption } from '$lib/game/Room';
import type { Definition } from '$lib/dicolink';

export type GameState = {
	word?: string;
	definition?: Definition;
	state?: RoomState;
	players?: Player[];
	winner?: Player;
	options?: RoomOption;
	ended?: boolean;
};
