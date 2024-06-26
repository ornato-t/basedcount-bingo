<script lang="ts">
	import type { PageData } from './$types';
	import type { DiscordMember } from '$lib/discordAPI';
	import Typehead from 'svelte-typeahead';
	import Box from './box.svelte';

	export let data: PageData;

	const extract = (entry: DiscordMember) => entry.name;

	let discord_id: string | null;
	let editBoxes = false;
	let imageBox = false;
	let text = '';
</script>

<main>
	<form method="POST" action="?/add" class="card md:w-96 bg-neutral shadow-xl mx-auto">
		<div class="card-body">
			<h2 class="text-xl">Add a new box</h2>
			<Typehead
				label="Triggering user (optional)"
				data={data.userList}
				{extract}
				limit={4}
				let:result
				on:select={(el) => (discord_id = el.detail.original.discord_id)}
				on:clear={() => (discord_id = null)}
			>
				<div class="flex items-center">
					<div class="avatar">
						<div class="h-6 rounded-full">
							<img src={result.original.image} alt="{result.original.name}'s avatar" />
						</div>
					</div>
					<span class="bg-neutral ml-2">
						{@html result.string}
					</span>
				</div>
			</Typehead>
			<div class="form-control">
				<div class="grid grid-cols-2">
					<label class="label" for="boxText">
						<span class="label-text">{imageBox ? 'Image' : 'Text'}</span>
					</label>

					<button type="button" class="btn btn-sm btn-square btn-outline btn-primary place-self-end mb-1" on:click={() => (imageBox = !imageBox)}>
						<i class="bx {imageBox ? 'bx-text' : 'bx-image-add'} " />
					</button>
				</div>
				{#if imageBox}
					<input
						type="url"
						id="boxText"
						class="input input-bordered input-secondary w-full"
						bind:value={text}
						required
						placeholder="https://i.imgur.com/something.jpg"
						pattern="https?:\/\/\S+\.(jpg|jpeg|png|gif|webp|svg)"
						autocomplete="off"
						autocapitalize="off"
					/>
				{:else}
					<textarea id="boxText" class="textarea textarea-bordered textarea-secondary h-24" bind:value={text} required placeholder="Some text for your new box" />
				{/if}
			</div>
			<input name="target" type="hidden" value={discord_id} />
			<input name="token" type="hidden" value={data.token} />
			<input name="text" type="hidden" value={imageBox ? `image:/${text}` : text} />
			<button type="submit" class="mt-6 btn btn-active btn-primary">Submit box</button>
		</div>
	</form>
	<div class="w-full grid place-items-center mt-4">
		<a class="btn btn-secondary w-full md:w-96" href="/play">
			<i class="bx bx-left-arrow-alt" />
			Back to your card
		</a>
	</div>

	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-6 place-items-center md:mx-4 mt-12 bg-neutral-focus py-5 shadow-xl rounded-2xl">
		<h2 class="col-span-full text-3xl">Boxes added by you</h2>
		{#each data.added as box}
			{#if editBoxes || !box.deleted}
				<form method="post" action="?/delete" class="relative">
					{#if editBoxes}
						<button class="btn btn-xs btn-circle {box.deleted ? 'btn-accent' : 'btn-error'} absolute top-7 left-[8.3rem] z-10">
							<i class="bx {box.deleted ? 'bx-redo text-accent-content' : 'bx-x text-error-content'} text-2xl relative bottom-1" />
						</button>
					{/if}
					{#if box.about_name}
							<div class="flex items-center overflow-clip whitespace-nowrap w-36 {box.deleted ? 'opacity-40' : ''}">
							<div class="avatar">
								<div class="h-6 rounded-full">
									<img src={box.about_image} alt="{box.about_name}'s avatar" />
								</div>
							</div>
							<span class="ml-2">
								{box.about_name}
							</span>
						</div>
					{:else}
						<span class="invisible"> Hi! </span>
					{/if}
					<Box {box} />
					<input name="box" type="hidden" value={box.box_id} />
					<input name="token" type="hidden" value={data.token ?? null} />
				</form>
			{/if}
		{/each}
		<div class="col-span-full w-full grid grid-cols-2 px-6">
			<label class="label cursor-pointer w-fit gap-2">
				<input type="checkbox" class="checkbox checkbox-secondary" bind:checked={editBoxes} />
				<span class="label-text">Edit boxes</span>
			</label>

			<div class="flex gap-6 place-self-end {editBoxes ? '' : 'invisible'}">
				<span>
					<i class="bx bx-x text-error-content bg-error text-xl px-1 rounded-full" />
					<span class="align-top">Delete box</span>
				</span>
				<span>
					<i class="bx bx-redo text-accent-content bg-accent text-xl px-1 rounded-full" />
					<span class="align-top">Restore box</span>
				</span>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-8 place-items-center md:mx-4 mt-12 bg-neutral-focus py-5 shadow-xl rounded-2xl">
		<h2 class="col-span-full text-3xl">Boxes added by other players</h2>
		{#each data.addedByOthers as box}
			<div class="flex flex-col">
				{#if box.about_name}
					<div class="flex items-center overflow-clip whitespace-nowrap w-36">
						<div class="avatar">
							<div class="h-6 rounded-full">
								<img src={box.about_image} alt="{box.about_name}'s avatar" />
							</div>
						</div>
						<span class="ml-2">
							{box.about_name}
						</span>
					</div>
				{:else}
					<span class="invisible"> Hi! </span>
				{/if}
				<Box {box} />
				<span class="text-sm"> Added by: </span>
				<div class="flex items-center overflow-clip whitespace-nowrap w-36">
					<div class="avatar">
						<div class="h-6 rounded-full">
							<img src={box.creator_image} alt="{box.creator_name}'s avatar" />
						</div>
					</div>
					<span class="ml-2">
						{box.creator_name}
					</span>
				</div>
			</div>
		{/each}
	</div>
</main>

<style>
	:global([data-svelte-typeahead]) {
		background-color: hsl(var(--n) / var(--tw-bg-opacity)) !important;
	}

	:global([data-svelte-search] input) {
		border-color: hsl(var(--s)) !important;
		background-color: hsl(var(--b1) / var(--tw-bg-opacity)) !important;
		border-radius: var(--rounded-btn, 0.5rem) !important;
	}
</style>
