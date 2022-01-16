<script lang="ts">
	import '../app.css';
	import AnimatedTitle from '$lib/components/AnimatedTitle.svelte';
	import { volume, gameState, player } from '$lib/stores';
	import { page } from '$app/stores';
</script>

<nav class="flex items-center justify-between flex-wrap bg-gray-900 p-6 w-full z-10 h-[80px]">
	<div class="flex items-center flex-shrink-0 text-white mr-6">
		<a class="text-white no-underline hover:text-white hover:no-underline" href="/">
			<span class="text-3xl pl-2 font-bold"
				><i class="em em-grinning"></i><AnimatedTitle title="MOTUS BATTLE ROYALE" /></span
			>
		</a>
		{#if $page.url.pathname.includes('/room/')}
			<h1 class="ml-6 font-bold text-2xl tracking-tight text-white"
				><span class="mr-4">-</span> Room {$page.params.name}</h1
			>
			<span
				class="ml-5 inline-flex items-center justify-center px-2 py-1 font-bold leading-none bg-m-blue rounded"
			>
				statut : {$gameState.state}
			</span>
		{/if}
	</div>

	<div class="flex-grow flex items-center" id="nav-content">
		<div class="lg:flex justify-end flex-1 items-center">
			{#if $page.url.pathname.includes('/room/') && $player}
				<div class="mr-5">
					Username: <span class="font-bold">{$player.username}</span>
				</div>
			{/if}
			<input id="volume" class="mr-4" bind:value="{$volume}" type="range" min="0" max="100" />
			<label for="volume">Volume {$volume}</label>
		</div>
	</div>
</nav>
<slot />
