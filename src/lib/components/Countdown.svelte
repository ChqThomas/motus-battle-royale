<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { tweened } from 'svelte/motion';
	export let countdown = 0;
	const dispatch = createEventDispatcher();

	let timer = null;
	const numbers = ['GO!', 1, 2, 3, 4, 5, 6, 7, 8, 9].reverse();
	$: seconds = countdown % 60;

	let secondL = tweened((9 - Math.floor((countdown % 60) % 10)) * 94, { duration: 300 });

	const val = tweened(0, { duration: 300 });

	onMount(() => {
		timer = setInterval(() => {
			countdown -= 1;
		}, 1000);
	});

	afterUpdate(() => {
		secondL.set((9 - Math.floor(seconds % 10)) * 94);
	});

	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
		}
	});

	$: {
		if (countdown === 0) {
			clearInterval(timer);
			timer = null;
			dispatch('completed');
		}
	}
</script>

<ul class="inline-block pl-0 h-[94px] overflow-hidden">
	{#each numbers as num, i}
		<li class="h-[94px] text-[64px]" style="transform: translateY(-{$secondL}px);">
			<span>{num}</span>
		</li>
	{/each}
</ul>
