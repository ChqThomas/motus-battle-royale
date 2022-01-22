import type { Socket } from '$lib/websockets';
import type Player from '$lib/game/Player';
import type { GameState } from '$lib/types';
import type Manager from '$lib/game/Manager';
import _ from 'lodash';

export type RoomState = 'waiting' | 'starting' | 'started' | 'finished';

export type PlayerWord = {
	player: string;
	word: string;
};

export default class Room {
	public manager: Manager;
	public state: RoomState;
	public name: string;
	public word: string;
	public sockets: Socket[];
	public players: Player[];
	public playerWords: PlayerWord[];
	public winner: Player;

	constructor(manager: Manager, name: string) {
		this.manager = manager;
		this.name = name;
		this.state = 'waiting';
		this.sockets = [];
		this.players = [];
		this.playerWords = [];
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
			playerWords: this.playerWords,
			winner: this.winner,
			players: this.sockets.map((socket) => socket.data.player),
		});
	}

	public async startGame(): Promise<void> {
		console.log('start game', this.name);
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
		console.log('reset game', this.name);
		this.updateGameState({
			state: 'waiting',
			word: '',
			playerWords: [],
			winner: null,
		});
	}

	public addWord(socket: Socket, word: string): void {
		console.log('new word', socket.id, word);

		socket.data.joined.playerWords.push({
			player: socket.data.player.username,
			word,
		});

		this.updateGameState({
			playerWords: socket.data.joined.playerWords,
		});

		if (word === socket.data.joined.word) {
			this.updateGameState({
				state: 'finished',
				winner: socket.data.player,
			});
		}
	}
}
