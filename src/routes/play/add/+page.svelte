<script lang="ts">
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
	import type { PageData } from './$types';
	import Typehead from 'svelte-typeahead';
	import type { DiscordMember } from './+page.server';
	import { regexImage, getImgUrl } from '$lib/image';

	export let data: PageData;

	const extract = (entry: DiscordMember) => entry.name;

	const added: typeof data.added = []; //This is a hack fetch names and images of of non players. It sucks, I'm aware
	for (const user of data.added) {
		if (user.about_name === null && user.about_image === null) {
			const match = data.userList.find((el) => el.discord_id === user.about_discord_id);
			added.push({
				id: user.id,
				about_discord_id: user.about_discord_id,
				about_image: match?.image ?? 'null',
				about_name: match?.name ?? '',
				text: user.text
			});
		} else {
			added.push(user);
		}
	}

	let discord_id: string | null;

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

	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-6 place-items-center md:mx-4 mt-12">
		<h2 class="col-span-full text-xl">Boxes added by you</h2>
		{#each added as box}
			<form method="post" action="?/delete">
				<button class="btn btn-xs btn-circle btn-error relative {box.about_name ? 'top-14' : 'top-8'} left-[8.3rem] z-10 text-neutral-content">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				{#if box.about_name}
					<div class="flex items-center">
						<div class="avatar">
							<div class="h-6 rounded-full">
								<img src={box.about_image} alt="{box.about_name}'s avatar" />
							</div>
						</div>
						<span class="ml-2">
							{box.about_name}
						</span>
					</div>
				{/if}
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
				<input name="box" type="hidden" value={box.id} />
				<input name="token" type="hidden" value={data.token ?? null} />
			</form>
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
