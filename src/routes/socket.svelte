<script lang="ts">
	import { io } from 'socket.io-client';
	const socket = io();

	let time = '';

	socket.on('time', (timeString) => {
		time = 'Server time: ' + timeString;
	});

	socket.on('click', (data) => {
		time = 'click !';
	});

	function handleClick() {
		socket.emit('click', {
			date: new Date(),
		});
	}
</script>

<div class="flex flex-col justify-center items-centers max-w-2xl mx-auto mb-16">
	<h1 class="font-bold text-4xl md:text-5xl tracking-tight mb-4 text-white text-center">Socket</h1>
	<div class="mb-8 prose leading-6 text-gray-100 text-center">{time}</div>
	<button on:click="{handleClick}">Clic !</button>
</div>
