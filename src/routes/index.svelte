<script lang="ts">
	import { goto } from '$app/navigation';
	import AnimatedTitle from '$lib/components/AnimatedTitle.svelte';

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
		<div class="flex flex-col justify-center mx-auto mb-16 max-w-2xl items-centers">
			<h1 class="mb-4 text-4xl font-bold tracking-tight text-center text-white md:text-5xl">
				<AnimatedTitle title="MOTUS BATTLE ROYALE" />
			</h1>
			<div class="mt-8 leading-6 text-center text-gray-100 prose"> </div>

			<div class="grid gap-0 sm:grid-cols-1">
<!--				<div class="relative p-8 border-r border-m-blue">-->
<!--					<button-->
<!--						on:click="{playSolo}"-->
<!--						class="px-6 py-4 text-2xl font-bold text-white rounded transition-colors bg-m-blue hover:bg-m-red hover:text-black"-->
<!--						>Jouer tout seul</button-->
<!--					>-->
<!--					<div class="absolute right-0 top-1/2 transform translate-x-7 -translate-y-7">-->
<!--						<p-->
<!--							class="flex justify-center items-center text-sm font-bold text-gray-500 bg-gray-50 rounded-full"-->
<!--						></p>-->
<!--					</div>-->
<!--				</div>-->
				<div class="p-8">
					<button
						on:click="{createGame}"
						class="px-6 py-4 text-2xl font-bold text-white rounded transition-colors bg-m-blue hover:bg-m-red hover:text-black"
						>Créer une partie</button
					>
				</div>
			</div>
		</div>
	</div>
</main>
