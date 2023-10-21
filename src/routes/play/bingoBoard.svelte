<script lang="ts">
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
	import type { BoxCheckable as Box } from './+page.server';

	export let cards: Box[];
	export let token: string;

	const regexImage = /image:\/\S+\.(jpg|jpeg|png|gif|webp|svg)/; //Matches image:/

	const getImgUrl = (card: Box) => card.text.substring(card.text.lastIndexOf(':') + 1); //Extracts "/sample.png" from "image:/sample.png"

	function boxClicked(box: Box) {
		document.querySelector(`input[name='box'][value='${box.id}']`)!.closest('form')!.submit();
	}
</script>

<div class="grid grid-cols-5 w-fit mx-auto rounded-lg border-2 border-secondary bg-neutral-focus select-none">
	{#each cards as box}
		<form method="post" action="?/check" class="w-16 h-16 sm:w-28 sm:h-28 border border-secondary cursor-pointer relative">
			<label>
				<input name="value" type="checkbox" class="opacity-0 absolute inset-0 w-full h-full" bind:checked={box.checked} on:change={() => boxClicked(box)}/>
				<div style="position: relative; {parent_style}">
					{#if regexImage.test(box.text)}
						<img src={getImgUrl(box)} alt={getImgUrl(box)} />
					{:else}
						<h1 use:fit>{box.text}</h1>
					{/if}
				</div>
				{#if box.checked}
					<svg class="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				{/if}
			</label>
			<input name="token" type="hidden" value={token} />
			<input name="box" type="hidden" value={box.id} />
		</form>
	{/each}
</div>
