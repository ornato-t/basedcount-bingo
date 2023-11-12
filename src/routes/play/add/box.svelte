<script lang="ts">
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
	import { regexImage, getImgUrl } from '$lib/image';

	export let box: { id: number; text: string; about_name: string; about_image: string; about_discord_id: string; };
</script>

<div class="w-36 h-36 md:w-40 md:h-40 rounded-2xl bg-neutral">
	{#if regexImage.test(box.text)}
		<div class="grid place-items-center w-full h-full">
			<img class="w-full" src={getImgUrl(box)} alt={getImgUrl(box)} />
		</div>
	{:else}
		<div style="position: relative; {parent_style}">
			<h1 class="p-1" use:fit>{box.text}</h1>
		</div>
	{/if}
</div>
