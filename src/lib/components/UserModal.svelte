<script lang="ts">
	import { ws, player, modal } from '$lib/stores';
	import { onMount } from 'svelte';
	async function handleSubmit() {
		$ws.emit('set-username', newUsername);
		localStorage.setItem('username', newUsername);
		$modal = null;
	}

	let newUsername = $player.username;
	let usernameInput: HTMLInputElement;

	onMount(() => {
		usernameInput.focus();
	});
</script>

<div
	class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle w-full"
>
	<form on:submit|preventDefault="{handleSubmit}">
		<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
			<div class="sm:flex sm:items-start">
				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="username"
						type="text"
						placeholder="Username"
						maxlength="30"
						bind:value="{newUsername}"
						bind:this="{usernameInput}"
					/>
				</div>
			</div>
		</div>
		<div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
			<button
				type="submit"
				class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-m-blue text-base font-medium text-white hover:bg-m-red focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
			>
				Valider
			</button>
			<button
				on:click|preventDefault="{() => ($modal = null)}"
				type="button"
				class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
			>
				Annuler
			</button>
		</div>
	</form>
</div>
