<script lang="ts">
	export let title = '';
	export let type = 'random';

	function getDelay(index) {
		if (type === 'random') {
			return Math.floor(Math.random() * 1000) + 1;
		} else {
			return index * 50;
		}
	}
</script>

{#each title as letter, index}<span style="animation-delay: {getDelay(index)}ms;" class="color-change-1">{letter}</span
	>{/each}
