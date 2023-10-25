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
		if (user.aboutName === null && user.aboutImage === null) {
			const match = data.userList.find((el) => el.discord_id === user.about_discord_id);
			added.push({
				id: user.id,
				about_discord_id: user.about_discord_id,
				aboutImage: match?.image ?? 'null',
				aboutName: match?.name ?? '',
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
	<form method="POST" class="card md:w-96 bg-neutral shadow-xl mx-auto">
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
				<div class="flex flex-col">
					<label class="label" for="boxText">
						<span class="label-text">Text</span>
					</label>

					<button class="btn btn-square btn-outline" on:click={() => (imageBox = !imageBox)}>
						<i class="bx {imageBox ? 'bx-image-add' : 'bx-text'} " />
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
					<textarea id="boxText" class="textarea textarea-bordered textarea-secondary h-24" bind:value={text} />
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
			<div>
				{#if box.aboutName}
					<div class="flex items-center">
						<div class="avatar">
							<div class="h-6 rounded-full">
								<img src={box.aboutImage} alt="{box.aboutName}'s avatar" />
							</div>
						</div>
						<span class="ml-2">
							{box.aboutName}
						</span>
					</div>
				{/if}
				<div class="w-36 h-36 md:w-40 md:h-40 rounded-2xl bg-neutral">
					<div style="position: relative; {parent_style}">
						{#if regexImage.test(box.text)}
							<img class="w-full" src={getImgUrl(box)} alt={getImgUrl(box)} />
						{:else}
							<h1 class="p-1" use:fit>{box.text}</h1>
						{/if}
					</div>
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
