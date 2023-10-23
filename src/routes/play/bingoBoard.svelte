<script lang="ts">
	import { serverId } from '$lib/discord';
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
	import type { BoxCheckable as Box } from './+page.server';

	export let cards: Box[];
	export let token: string;
	export let className: string;

	const regexImage = /image:\/\S+\.(jpg|jpeg|png|gif|webp|svg)/; //Matches image:/

	const getImgUrl = (card: Box) => card.text.substring(card.text.lastIndexOf(':') + 1); //Extracts "/sample.png" from "image:/sample.png"

	let selectedBox: Box = { about_discord_id: null, checked: false, creator_discord_id: '', id: NaN, text: '' };

	function boxClicked(box: Box) {
		if (box.checked) {
			//If the box is being checked ask for confirmation
			selectedBox = box;
			// @ts-ignore
			clickBox.showModal();
		} else {
			//If the box is being unchecked just submit the form
			document.querySelector(`input[name='box'][value='${box.id}']`)!.closest('form')!.submit();
		}
	}
</script>

<article class="grid grid-cols-5 w-fit mx-auto rounded-lg border-2 border-secondary bg-neutral-focus select-none {className}">
	{#each cards as box}
		<form method="post" action="?/check" class="w-16 h-16 sm:w-28 sm:h-28 border border-secondary cursor-pointer relative">
			<label>
				<input name="value" type="checkbox" class="opacity-0 absolute inset-0 w-full h-full" bind:checked={box.checked} on:change={() => boxClicked(box)} />
				<div style="position: relative; {parent_style}">
					{#if regexImage.test(box.text)}
						<img src={getImgUrl(box)} alt={getImgUrl(box)} />
					{:else}
						<h1 use:fit>{box.text}</h1>
					{/if}
					{#if box.checked}
						<svg class="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					{/if}
				</div>
			</label>
			<input name="token" type="hidden" value={token} />
			<input name="box" type="hidden" value={box.id} />
		</form>
	{/each}
</article>

<dialog id="clickBox" class="modal">
	<div class="modal-box max-w-md">
		<h3 class="font-bold text-lg">Confirm your action</h3>

		<p class="pt-4">You are trying to tick the following box:</p>
		<p class="pl-2 py-4 font-mono">{selectedBox.text}</p>
		<p class="">Enter a link to the message that triggered it.</p>
		<p class="py-1.5 text-sm italic">Hint: right click the message and select "Copy message link"</p>

		<form method="post" action="?/check" class="modal-action flex flex-col">
			<input 
				type="url" name="url" id="url" title="the URL must be a Discord message link" required
				placeholder="https://discord.com" pattern="https:\/\/discord\.com\/channels\/{serverId}\/\d+\/\d+" autocomplete="off" autocapitalize="off"
				class="input input-bordered input-primary w-full"
			/>
			<input name="token" type="hidden" value={token} />
			<input name="box" type="hidden" value={selectedBox.id} />
			<input name="value" type="hidden" value={selectedBox.checked} />

			<div class="mt-8 modal-action">
				<!-- svelte-ignore missing-declaration -->
				<button
					class="btn btn-secondary btn-outline"
					type="button"
					on:click={() => {
						// @ts-ignore
						clickBox.close();
					}}
				>
					Close
				</button>
				<button type="submit" class="btn btn-secondary"> Confirm </button>
			</div>
		</form>
	</div>
</dialog>
