<script lang="ts">
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
	import type { Box } from '$lib/bingo';

	export let cards: Box[];

	const regexImage = /image:\/\S+\.(jpg|jpeg|png|gif|webp|svg)/; //Matches image:/

    const getImgUrl = (card: Box) => card.text.substring(card.text.lastIndexOf(':') + 1);   //Extracts "/sample.png" from "image:/sample.png"
</script>

<div class="grid grid-cols-5 w-fit mx-auto rounded-lg border-2 border-secondary bg-neutral-focus select-none">
	{#each cards as box}
		<div class="w-16 h-16 sm:w-28 sm:h-28 border border-secondary {regexImage.test(box.text) ? '' : 'p-1.5'}">
			<div style="position: relative; {parent_style}">
				{#if regexImage.test(box.text)}
					<img src={getImgUrl(box)} alt={getImgUrl(box)} />
				{:else}
					<h1 use:fit>{box.text}</h1>
				{/if}
			</div>
		</div>
	{/each}
</div>
