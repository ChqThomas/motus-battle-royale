import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

export const ws: Readable<Socket> = readable(io());
