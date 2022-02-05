<script lang="ts">
	import type { RoomOption } from '$lib/game/Room';

	export let player;
	export let options: RoomOption;
</script>

{#each Array(options.maxHealth) as _, i}
	<i
		class="{player.health >= i + 1 ? 'fa' : 'far'} {player.health === 1 && i === 0
			? 'animate-pulse'
			: ''} fa-heart text-m-red mr-1"></i>
{/each}
