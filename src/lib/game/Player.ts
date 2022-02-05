import { uniqueNamesGenerator, Config, colors, animals } from 'unique-names-generator';
import type { RoomOption } from '$lib/game/Room';

export type PlayerWord = {
	player: string;
	word: string;
};

const customConfig: Config = {
	dictionaries: [colors, animals],
	separator: '-',
	length: 2,
};

export default class Player {
	public id: string;
	public username: string;
	public owner: boolean;
	public words: string[];
	public giveup: boolean;
	public health: number;
	public roomOptions: RoomOption;
	constructor(id: string, username?: string) {
		this.id = id;
		this.username = username || uniqueNamesGenerator(customConfig);
		this.words = [];
		this.giveup = false;
		this.health = 3;
	}

	public reset(): void {
		this.words = [];
		this.giveup = false;
		this.health = this.roomOptions.maxHealth || 3;
	}

	public resetRound(): void {
		this.words = [];
		this.giveup = false;
	}

	public giveUp(): void {
		this.giveup = true;
	}

	public setRoom(roomOptions: RoomOption): void {
		this.roomOptions = roomOptions;
		this.health = roomOptions.maxHealth;
	}
}
