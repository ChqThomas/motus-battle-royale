import type { Socket } from '$lib/websockets';
import type Player from '$lib/game/Player';
import type { GameState } from '$lib/types';
import type Manager from '$lib/game/Manager';
import _ from 'lodash';

export type RoomState = 'waiting' | 'starting' | 'started' | 'finished';

export type RoomOption = {
	maxHealth: number;
	maxGuesses: number;
};

export default class Room {
	public manager: Manager;
	public state: RoomState;
	public name: string;
	public word: string;
	public sockets: Socket[];
	public players: Player[];
	public winner: Player;
	public ended: boolean;
	public options: RoomOption;

	constructor(manager: Manager, name: string) {
		this.manager = manager;
		this.name = name;
		this.state = 'waiting';
		this.sockets = [];
		this.players = [];
		this.ended = false;
		this.options = {
			maxHealth: 3,
			maxGuesses: 6,
		};
	}

	public addPlayer(socket: Socket): boolean {
		// On ne peut pas rejoindre une partie lancée, ni rejoindre deux fois la même room
		if (this.state !== 'waiting' || _.find(this.sockets, socket)) {
			return false;
		}

		// Le premier joueur devient le propriétaire de la room
		if (this.players.length === 0) {
			socket.data.player.owner = true;
		}

		this.sockets.push(socket);
		socket.join(this.name);
		socket.data.joined = this;
		socket.data.player.setRoom(this.options);
		console.log('join', socket.id, this.name);
		console.log('this players', this.name, this.players.length);

		this.updateGameState({
			players: this.sockets.map((socket) => socket.data.player),
		});

		return true;
	}

	public removePlayer(socket: Socket): void {
		_.remove(this.sockets, { id: socket.id });
		console.log('removed from room', socket.id, this.name);
		if (this.players.length > 0) {
			// On transfert le statut de propriétaire à un autre joueur
			if (socket.data.player.owner === true) {
				this.players[0].owner = true;
			}
			this.updateGameState({
				players: this.sockets.map((socket) => socket.data.player),
			});
		}
	}

	public setOption(options: RoomOption): void {
		this.options = options;
		this.players.forEach((p) => {
			p.setRoom(options);
		});
		this.updateClientGameState();
	}

	public updateGameState(gameState: GameState): void {
		for (const [key, value] of Object.entries(gameState)) {
			this[key] = value;
		}

		this.manager.io.to(this.name).emit('update-game-state', gameState);
	}

	public updateClientGameState(): void {
		this.manager.io.to(this.name).emit('update-game-state', {
			word: this.word,
			state: this.state,
			winner: this.winner,
			players: this.players,
			options: this.options,
		});
	}

	public async startGame(): Promise<void> {
		this.updateGameState({
			state: 'starting',
		});
		await new Promise((r) => setTimeout(r, 3000));
		this.updateGameState({
			state: 'started',
			word: this.manager.getRandomWord(),
		});
		console.log(this.word);
	}

	public async resetGame(): Promise<void> {
		this.players.forEach((p) => p.reset());
		this.updateGameState({
			state: 'waiting',
			word: '',
			players: this.players,
			winner: null,
			ended: false,
		});
	}

	public async resetRound(): Promise<void> {
		this.players.forEach((p) => p.resetRound());
		this.updateGameState({
			state: 'waiting',
			word: '',
			players: this.players,
			winner: null,
		});
	}

	public addWord(socket: Socket, word: string): void {
		console.log('new word', socket.id, word);

		socket.data.player.words.push(word);

		this.updateClientGameState();

		if (word === socket.data.joined.word) {
			this.setFinished(socket.data.player);
		} else if (this.isFinished()) {
			this.updateGameState({
				state: 'finished',
				winner: null,
				ended: this.isEnded(),
			});
		}
	}

	public setFinished(winner?: Player): void {
		this.players.filter((p) => p !== winner && p.health > 0).forEach((p) => p.health--);
		console.log('ended', this.isEnded());
		this.updateGameState({
			state: 'finished',
			players: this.players,
			winner,
			ended: this.isEnded(),
		});
	}

	public isFinished(): boolean {
		return this.players.every((p) => {
			return p.giveup === true || p.words.length >= this.options.maxGuesses;
		});
	}

	public isEnded(): boolean {
		return (
			this.players.filter((p) => {
				return p.health > 0;
			}).length <= 1
		);
	}
}
