<script context="module">
	export const ssr = false;
</script>

<script lang="ts">
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.css';
	import AnimatedTitle from '$lib/components/AnimatedTitle.svelte';
	import Soundboard from '$lib/components/Soundboard.svelte';
	import { volume, gameState, player, soundboard, modal } from '$lib/stores';
	import { page } from '$app/stores';
	import { Modal, bind } from 'svelte-simple-modal';
	import UserModal from '$lib/components/UserModal.svelte';

	const editUser = () => {
		modal.set(bind(UserModal));
	};
</script>

<nav class="flex items-center justify-between flex-wrap bg-gray-900 p-6 w-full z-10 h-[80px] fixed top-0">
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
				<div class="mr-5 flex justify-end flex-1 items-center cursor-pointer hover:text-m-yellow">
					<i class="fa fa-user"></i>
					<div class="ml-2" on:click="{editUser}">
						<span class="font-bold">{$player.username}</span>
					</div>
				</div>
			{/if}
			<input id="volume" class="ml-4 mr-4" bind:value="{$volume}" type="range" min="0" max="100" />
			<div class="w-[20px]">
				<i
					class="fa"
					class:fa-volume-mute="{$volume === 0}"
					class:fa-volume-down="{$volume < 50}"
					class:fa-volume-up="{$volume >= 50}"></i>
			</div>
		</div>
	</div>
</nav>
<slot />
<div class="bg-gray-800 pt-2 fixed bottom-0 w-full">
	<div class="flex pb-5 px-5 m-auto pt-5 text-white text-sm flex-col md:flex-row w-full">
		<div class="flex-auto flex-row-reverse mt-2 flex items-center">
			<a target="_blank" href="https://twitter.com/ChqThomas" class="mx-2 w-6">
				<svg
					class="fill-current cursor-pointer text-white hover:text-[#1DA1F2]"
					width="100%"
					height="100%"
					viewBox="0 0 24 24"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2;"
				>
					<path
						d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
					></path>
				</svg>
			</a>
			<a target="_blank" href="https://github.com/Chokapix/motus-battle-royale" class="mx-2 w-6">
				<svg
					class="fill-current cursor-pointer text-white hover:text-gray-300"
					width="100%"
					height="100%"
					role="img"
					viewBox="0 0 24 28"
					xml:space="preserve"
					style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2;"
					xmlns="http://www.w3.org/2000/svg"
					><title>GitHub</title><path
						d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
					></path></svg
				>
			</a>
			<div class="mr-2"
				>Made with ✨ by <a class="text-m-yellow hover:text-m-red" href="https://chokapix.fr/" target="_blank"
					>Thomas Choquet</a
				></div
			>
		</div>
	</div>
</div>

<Soundboard bind:this="{$soundboard}" />
<Modal show="{$modal}" />
