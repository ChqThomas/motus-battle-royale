import type Player from '$lib/game/Player';
import type { RoomState, RoomOption } from '$lib/game/Room';

export type GameState = {
	word?: string;
	state?: RoomState;
	players?: Player[];
	winner?: Player;
	options?: RoomOption;
	ended?: boolean;
};
