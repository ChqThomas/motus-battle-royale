<script lang="ts">
	import { ws, modal, gameState } from '$lib/stores';
	async function handleSubmit() {
		$ws.emit('set-options', {
			maxHealth,
			maxGuesses,
		});
		$modal = null;
	}

	let maxHealth = $gameState.options.maxHealth;
	let maxGuesses = $gameState.options.maxGuesses;
</script>

<div
	class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle w-full"
>
	<form on:submit|preventDefault="{handleSubmit}">
		<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
			<div>
				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="maxHealth">Nombre de vies</label>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="maxHealth"
						type="number"
						placeholder="3"
						bind:value="{maxHealth}"
					/>
				</div>
				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="maxGuesses"
						>Nombre de tentatives</label
					>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="maxGuesses"
						type="number"
						placeholder="6"
						bind:value="{maxGuesses}"
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
