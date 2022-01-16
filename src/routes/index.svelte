<script lang="ts">
	import { goto } from '$app/navigation';

	function createGame() {
		let roomName = (Math.random() + 1).toString(36).substring(7).toUpperCase();
		goto(`/room/${roomName}`);
	}

	function playSolo() {
		goto(`/single-player`);
	}
</script>

<main class="flex h-screen">
	<div class="m-auto">
		<div class="flex flex-col justify-center items-centers max-w-2xl mx-auto mb-16">
			<h1 class="font-bold text-4xl md:text-5xl tracking-tight mb-4 text-white text-center">MOTUS VS</h1>
			<div class="mt-8 prose leading-6 text-gray-100 text-center"> </div>

			<div class="grid sm:grid-cols-2 gap-0">
				<div class="border-b-0 sm:border-r p-8 relative">
					<button
						on:click="{playSolo}"
						class="text-2xl bg-m-blue hover:bg-m-red text-white hover:text-black transition-colors font-bold py-4 px-6 rounded"
						>Jouer tout seul</button
					>
					<div class="absolute right-0 transform translate-x-7 top-1/2 -translate-y-7">
						<p
							class="font-bold text-gray-500 rounded-full bg-gray-50 flex items-center justify-center text-sm"
						></p>
					</div>
				</div>
				<div class="p-8">
					<button
						on:click="{createGame}"
						class="text-2xl bg-m-blue hover:bg-m-red text-white hover:text-black transition-colors font-bold py-4 px-6 rounded"
						>Créer une partie</button
					>
				</div>
			</div>
		</div>
	</div>
</main>
