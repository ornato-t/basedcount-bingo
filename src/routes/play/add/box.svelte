<script lang="ts">
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
	import { regexImage, getImgUrl } from '$lib/image';
	import type { Box } from './+page.server';

	export let box: Box;

	const boxText = { text: box.box_text };
</script>

<div class="w-36 h-36 md:w-40 md:h-40 rounded-2xl bg-neutral {box.deleted ? 'opacity-40' : ''}">
	{#if box.box_text !== null}
		{#if regexImage.test(box.box_text)}
			<div class="grid place-items-center h-full w-full py-0.5">
				<img class="relative h-full w-full object-contain" src={getImgUrl({ text: box.box_text })} alt="Couldn't load" />
			</div>
		{:else}
			<div style="position: relative; {parent_style}">
				<h1 class="p-1" use:fit>{boxText.text}</h1>
			</div>
		{/if}
	{:else}
		<div style="position: relative; {parent_style}">
			<h1 class="p-2 italic" use:fit>You can't see boxes about yourself.</h1>
		</div>
	{/if}
</div>
