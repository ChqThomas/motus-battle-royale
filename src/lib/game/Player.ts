import { uniqueNamesGenerator, Config, colors, animals } from 'unique-names-generator';

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
	public lives: number;
	constructor(id: string, username?: string) {
		this.id = id;
		this.username = username || uniqueNamesGenerator(customConfig);
		this.words = [];
		this.giveup = false;
		this.lives = 3;
	}

	public reset(): void {
		this.words = [];
		this.giveup = false;
		this.lives = 3;
	}

	public giveUp(): void {
		this.giveup = true;
	}
}
