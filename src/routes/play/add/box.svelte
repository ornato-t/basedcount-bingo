<script lang="ts">
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
	import { regexImage, getImgUrl } from '$lib/image';

	export let box: { box_id: number; box_text: string | null; about_name: string; about_image: string; about_discord_id: string };

	const boxText = { text: box.box_text };
</script>

{#if box.box_text !== null}
	<div class="w-36 h-36 md:w-40 md:h-40 rounded-2xl bg-neutral">
		{#if regexImage.test(box.box_text)}
			<div class="grid place-items-center w-full h-full">
				<img class="w-full" src={getImgUrl({ text: box.box_text })} alt={getImgUrl({ text: box.box_text })} />
			</div>
		{:else}
			<div style="position: relative; {parent_style}">
				<h1 class="p-1" use:fit>{boxText.text}</h1>
			</div>
		{/if}
	</div>
{:else}
	<div class="w-36 h-36 md:w-40 md:h-40 rounded-2xl bg-neutral">
		<div style="position: relative; {parent_style}">
			<h1 class="p-2 italic" use:fit>
				You can't view cards about yourself
			</h1>
		</div>
	</div>
{/if}
