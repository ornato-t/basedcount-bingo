<script lang="ts">
	import { serverId } from '$lib/discord';
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
	import type { BoxCheckable as Box } from './+page.server';
	import { regexImage, getImgUrl } from '$lib/image';
	import { enhance } from '$app/forms';

	export let cards: Box[];
	export let token: string;
	export let className: string;

	let selectedBox: Box = { about_discord_id: null, checked: false, creator_discord_id: '', id: NaN, text: '' };

	function boxClicked(box: Box) {
		box.checked = !box.checked;

		if (box.checked) {
			selectedBox = box;
			// @ts-ignore
			clickBox.showModal();
		}
	}
</script>

<article class="grid grid-cols-5 w-fit h-fit mx-auto rounded-lg border-2 border-primary bg-neutral-focus select-none {className}">
	{#each cards as box}
		<form method="post" action="?/uncheck" class="w-[4.5rem] h-[6rem] sm:w-28 sm:h-28 border border-primary cursor-pointer relative" use:enhance>
			<label>
				<button type="submit" class="opacity-0 absolute inset-0 w-full h-full" on:click={() => boxClicked(box)} />
				<div style="position: relative; {parent_style}">
					{#if box.about_image}
					<div class="grid place-items-center h-full w-full">
						<img class="z-0 absolute top-0 left-0 h-full w-full object-contain opacity-20" src={box.about_image} alt="{box.about_name}" />
					</div>
					{/if}
					{#if regexImage.test(box.text)}
						<div class="grid place-items-center h-full w-full">
							<img class="z-10 absolute top-0 left-0 h-full w-full object-contain" src={getImgUrl(box)} alt={getImgUrl(box)} />
						</div>
					{:else}
						<h1 class="z-30 absolute top-0 left-0 p-1 w-full h-full grid place-items-center" use:fit>{box.text}</h1>
					{/if}
					{#if box.checked}
						<svg class="absolute top-0 left-0 w-full h-full fill-error z-20" viewBox="0 0 150 150">
							<g>
								<path
									d="M146.4,112.5c-0.3-0.3-0.9-0.9-1.3-1.3c-0.2-0.2-0.6-0.6-0.8-0.9   c1.1-0.4,2.1-0.7,3.2-1.1c-0.9-1.5-1.8-3.1-2.9-4.4c-0.7-0.8-1.4-1.5-2-2.3c0.3-0.7,0.7-1.4,1-2.1c0.1-0.2,0.1-0.3,0-0.5   c-1.9-3.9-4.2-7.5-6.3-11.2c0,0,0,0,0,0c-2.5-5.8-7.6-9.9-10.8-15.3c5.9,4.7,10,11.3,16,15.8c0.5,0.4,1.2-0.2,0.8-0.8   c-4.1-6-9.4-11.2-14.4-16.4c-3.8-3.9-8.8-6.6-11.9-11.1c6.9-4.3,14.7-8,19.6-14.5c0.4-0.5-0.2-1.2-0.8-0.8   c-5.6,3.2-10.8,7-16.4,10.1c-4.7,2.7-9.6,5.3-13.6,9c-0.3-0.4-1-1.2-1.3-1.6c4.2-2.9,8.6-5.6,12.5-8.9c5.2-4.6,11.2-8,17-11.8   c3.4-1.9,6.9-3.7,9.9-6.2c2.5-2,3.2-5.1,3.9-8.1c0.1-0.7-0.6-1.2-1.2-0.9c-0.3,0.2-0.6,0.3-0.9,0.5c-0.7,0.4-1.5-0.4-1.1-1.1   c1.3-2.1,2.1-4.3,2.1-6.8c0-0.4-0.4-0.8-0.8-0.8c-0.5,0-0.9-0.4-0.8-0.9c0.1-0.6,0.2-1.3,0.3-1.9c0.1-0.5-0.4-1-0.9-0.9   c-0.3,0-0.6,0.1-0.8,0.2c-0.8-1.3-0.8-1.3-1.5-2.6c1.3-1.5,2.5-3,3.7-4.6c0.6-0.7-0.4-1.7-1.1-1.1c-0.7,0.5-1.5,1.1-2.2,1.6   c-0.6,0.4-1.4-0.1-1.3-0.8c0-0.3,0.1-0.6,0.1-0.9c0.1-0.8-0.8-1.2-1.4-0.7c-0.3,0.3-0.6,0.6-0.9,0.9c-0.1,0.1-0.1,0.1-0.2,0.2   c-3,1.5-6.4,1.9-9.3,0.5c-0.5-0.2-0.6-0.9-0.2-1.3c0.8-0.8,1.7-1.6,2.6-2.3c0.5-0.4,0.3-1.3-0.4-1.4c-1.5-0.3-3.1-0.2-4.7,0.1   c-0.7,0.1-1.2-0.6-0.9-1.2c0.2-0.4,0.5-0.9,0.7-1.3c-1.3,0.6-2.6,1.3-3.9,2c-1.3,0.7-2.6,1.4-3.9,2.1c-0.6,0.4-1.3-0.2-1.2-0.9   c0.2-1,0.6-1.9,1.1-2.7c0.3-0.5,0-1.2-0.7-1.2h-3.6c-0.2,0-0.4,0.1-0.5,0.2c-1.1,0.9-2.1,1.8-3.1,2.8L110,3.5   c-2.3,1.1-4.7,2.2-7.1,3.3c0.1-1.3,0.2-2.7,0.3-4c-1.6,1.3-3.2,2.6-4.8,3.9c0.7-1.3,1.4-2.7,2.2-4.1c-2,1.1-4,2.3-6.1,3.2   c-1.1,0.3-2.2,0.7-3.3,1C94,4.4,96.9,2,100.1,0h-3c-5.4,2.9-10.7,6-15.7,9.5c-4.6,3.4-9.4,6.4-14.4,9.3c-4.4-4.7-9.4-8.9-15-12.2   C52,7.1,52,8.1,52,8.6c-1.6-0.6-3.2-1.2-4.8-1.8c5,5.2,11.1,9.2,16.3,14.2c-1,0.3-2.2,0.4-3-0.4c-2.6-1.9-5.2-3.8-8-5.2   c2,2.1,4,4.1,6.1,6.2c-0.5,0-1.6,0.1-2.2,0.1c-1.8-1.1-3.7-2.2-5.5-3.4c-3.4-2.5-6.6-5.4-10.2-7.7c-0.6-0.4-1.4,0.2-1.1,0.9   c0,0,0,0,0,0c0.2,0.6-0.4,1.2-1,0.9c-3-1.3-6-2.6-8.9-4.1c-0.5-0.3-1.1,0.1-1.1,0.6c0,0.5,0,1,0,1.4c0,0.2,0.1,0.5,0.4,0.6   c1.3,0.7,2.6,1.4,4,1.9c0.2,0.1,0.4,0.3,0.4,0.5c0.1,0.6,0.3,1.2,0.4,1.8c0.1,0.6-0.5,1.1-1.1,0.8c-3.3-1.6-6.7-3-10.5-2.6   c-0.3,0-0.5-0.1-0.7-0.3c-1.5-1.9-3.4-3.5-5.6-4.7C15.3,8,14.5,9,15.1,9.6c1.1,1,2.2,2,3.3,3c-1.1-0.5-2.3-1-3.4-1.6   c-0.5-0.2-1.1,0.2-1,0.7c0.2,2.4,0.8,4.9,2.2,6.9l0.4,0.7c-1.9-1.4-4-2.6-6.3-2.8c-0.7-0.1-1.1,0.8-0.5,1.3c1.2,1,2.4,2,3.5,3   c0.5,0.4,0.2,1.2-0.4,1.3c-1.4,0.1-2.9,0.2-4.3,0.3c-0.6,0-0.9,0.8-0.5,1.2c3.5,3.7,6.7,7.8,9.9,11.7c-0.3,0.4-0.2,0.3-0.5,0.7   c-1.8-0.7-3.5-1.5-5.2-2.4c-0.7-0.3-1.4,0.4-1,1c0.4,0.6,0.7,1.3,1.1,1.9c-2.7-1.5-5.4-3.2-7.8-5.3v1c0,0.2,0.1,0.5,0.3,0.6   c3.8,2.4,6.8,5.7,8.9,9.5c-3.7,0.2-6.8-1.9-9.3-4.4v1.6c0.9,0.9,1.8,1.7,2.7,2.6c1,4.5,6,6.2,8.9,9.2c3.9,4.5,7.7,9.1,12.7,12.4   c-0.1,1.2-0.3,2.4-0.4,3.6c-4.9-3.7-9.2-8.8-14.9-11.4c-1.1-0.5-2,0.9-1.2,1.7c4.9,4.4,10.3,8.2,14.9,12.8c-0.4,1.3-0.7,2.7-1.1,4   C20,70.4,15.5,64,8.3,61.4c5.5,6,12.6,10.3,18.2,16.2c-0.6,3.1-1.3,6.5-3.7,8.8c-4,4.2-8,8.4-10.2,13.8c4.9-4.7,8.2-10.9,13.8-15   c-2.8,6.4-7.3,11.7-10.9,17.5c-0.3,0.5,0.3,1.2,0.9,0.9c0.8-0.4,1.5-0.9,2.3-1.3c0.5-0.3,1.1,0.2,0.9,0.7   c-1.1,3.5-2.6,6.9-4.2,10.2c-0.3,0.6,0.6,1.2,1,0.7c1.1-1.2,2.2-2.4,3.3-3.6c0.5-0.5,1.3,0,1.1,0.6c-1.3,3.4-3.8,6.3-5.7,9.4   c-0.4,0.6,0.5,1.3,1,0.8c1.1-1,2.1-2.1,3.1-3.1c0.2-0.2,0.5-0.2,0.7-0.1l1.4,0.5c0.1,0.4,0.2,0.5,0.3,1c-1.6,2.5-3.1,5-4.5,7.6   c-0.3,0.5,0.2,1,0.7,0.9c3-0.6,6-0.5,8.9,0.5c-2,3.1-4.1,6.2-6,9.5c-0.3,0.6,0.4,1.2,0.9,0.8c0,0,0,0,0,0c0.6-0.4,1.2,0.2,0.9,0.8   c-1.4,2.5-2.8,5-4.4,7.4h1.4c0.2,0,0.4-0.1,0.5-0.3c2.7-3.6,5.2-7.5,9.2-9.8c2.5-1.7,5.6-1.2,8.5-1.2c-1.7,2.7-3.5,5.4-5.3,8.1   c2.4-1.3,4.8-2.5,7.4-3.4c0.3-0.1,0.9-0.3,1.2-0.4c-0.6,2.4-1.2,4.7-1.9,7h1c2.5-3.1,4.8-6.2,7.5-9l1.6,0.8c0,0,0,0,0,0   c-0.3,1.2,1.2,1.9,1.9,1c0.8-1.1,1.7-2.1,2.6-3.1c2.9-2.6,6-5.1,8-8.4c0.5,0.3,1.4,0.9,1.9,1.2c-2.9,4.1-7.2,7.6-9.2,12.3   c-0.4,1.1,0.9,2,1.8,1.2c3.2-2.8,5.9-6,8.3-9.4c3.6-4.3,7.4-8.6,10-13.6c8.1,3.8,13.1,11.3,18.3,18c1.4,1.9,3.3,3.3,5.3,4.5   c-7.3-8.1-13-17.8-22.4-23.8c1-1.1,1.9-2.3,2.9-3.4c6.6,4.4,11,11.1,15.8,17.1c1.4,1.9,3.5,2.8,5.7,3.5c0.7,0.2,1.3-0.6,0.8-1.2   c-6.4-7.7-11.9-16.4-20.8-21.5c0.6-0.8,1.2-1.6,1.7-2.4c5.1,3.6,8.8,8.7,13.7,12.4c3.8,2.8,6.5,6.7,9.6,10.2c2.6,3.5,6.2,6,10,8.1   c0.7,0.4,1.5-0.5,1-1.1c-0.2-0.2-0.3-0.4-0.5-0.6c-0.4-0.5,0-1.3,0.7-1.2l1.2,0.2c0.7,0.1,1.1-0.7,0.7-1.2v0l2-2.5   c4,1.4,7.7,3.4,11.7,4.6c0.7,0.2,1.2-0.5,0.9-1.1c-1.6-2.7-3-5.4-3.6-8.5c2,1.2,4,2.4,5.9,3.7c0.7,0.4,1.5-0.3,1.1-1   c-0.5-0.9-1-1.9-1.4-2.9c0.4-1.2,0.9-2.3,1.3-3.5c2.7-0.4,5.4-0.8,8.1-1.2c-1.2-1.6-2.5-3.2-3.7-4.8c2.2,0.7,4.3,1.4,6.5,2.1   c-0.5-0.9-1-1.9-1.5-2.8c0.6-0.2,1.8-0.5,2.4-0.7C147.5,116.8,146.9,114.7,146.4,112.5 M125.7,76.2c-2.4-1.1-4.7-2.5-6.6-4.3   c-2.6-2.3-5.8-4.1-7.5-7.3C117.6,66.3,122.6,70.9,125.7,76.2 M66,31.6c0.2-0.6,0.5-1.7,0.7-2.3c8.6-5.3,16.4-11.9,25.5-16.4   c0.4,0.1,1.3,0.4,1.8,0.6C84.8,19.7,75.6,26.1,66,31.6 M28.8,99.8c0.2-4,1.9-7.6,4.1-10.9c0.3,0.9,0.9,2.8,1.1,3.7   C32.2,94.9,30.6,97.4,28.8,99.8"
								/>
							</g>
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
		{#if regexImage.test(selectedBox.text)}
			<div class="py-4 grid place-items-center w-full h-full">
				<img class="h-36" src={getImgUrl(selectedBox)} alt={getImgUrl(selectedBox)} />
			</div>
		{:else}
			<p class="pl-2 py-4 font-mono">{selectedBox.text}</p>
		{/if}
		<p class="">Enter a link to the message that triggered it.</p>
		<p class="py-1.5 text-sm italic">Hint: right click the message and select "Copy message link"</p>

		<form method="post" action="?/check" class="modal-action flex flex-col" use:enhance>
			<input
				type="url"
				name="url"
				id="url"
				title="the URL must be a Discord message link"
				required
				placeholder="https://discord.com"
				pattern="https:\/\/discord\.com\/channels\/{serverId}\/\d+\/\d+\s*$"
				autocomplete="off"
				autocapitalize="off"
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
				<!-- svelte-ignore missing-declaration -->
				<button
					type="submit"
					class="btn btn-secondary"
					on:click={() => {
						// @ts-ignore
						clickBox.close();
					}}
				>
					Confirm
				</button>
			</div>
		</form>
	</div>
</dialog>
