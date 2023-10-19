<script lang="ts">
	import type { PageData } from './$types';
	import Typehead from 'svelte-typeahead';
	import type { DiscordMember } from './+page.server';

	export let data: PageData;

	const extract = (entry: DiscordMember) => entry.name;

	const added: typeof data.added = [];	//This is a hack to cards from non players. It sucks, I'm aware
	for(const user of data.added){
		if(user.name === null && user.image === null){
			const match = data.userList.find(el => el.discord_id === user.discord_id);
			added.push({
				discord_id: user.discord_id,
				image: match?.image ?? 'null',
				name: match?.name ?? '',
				text: user.text
			})
		} else {
			added.push(user);
		}
	}

	let discord_id: string;
</script>

<main>
	<form method="POST" class="card w-96 bg-base-200 shadow-xl mx-auto">
		<div class="card-body">
			<h2 class="text-xl">Add a new card</h2>
			<Typehead label="Triggering user" data={data.userList} {extract} limit={4} let:result on:select={(el) => (discord_id = el.detail.original.discord_id)}>
				<div class="flex items-center">
					<div class="avatar">
						<div class="h-6 rounded-full">
							<img src={result.original.image} alt="{result.original.name}'s avatar" />
						</div>
					</div>
					<span class="bg-base-200 ml-2">
						{@html result.string}
					</span>
				</div>
			</Typehead>
			<div class="form-control">
				<label class="label" for="boxText">
					<span class="label-text">Text</span>
				</label>
				<textarea id="boxText" name="text" class="textarea textarea-bordered textarea-secondary h-24" />
			</div>
			<input name="target" type="hidden" value={discord_id} />
			<input name="token" type="hidden" value={data.token} />
			<button type="submit" class="mt-6 btn btn-active btn-primary">Submit card</button>
		</div>
	</form>

	<div class="grid grid-cols-3 gap-4">
		<span class="col-span-full"> Cards added by you: </span>
		{#each added as card}
			<div class="card w-96 bg-base-100 shadow-xl image-full">
				<figure><img src={card.image} alt="{card.name}'s avatar" /></figure>
				<div class="card-body">
					<h2 class="card-title">{card.text}</h2>
					<p>{card.name}</p>
				</div>
			</div>
		{/each}
	</div>
</main>

<style>
	:global([data-svelte-typeahead]) {
		@apply text-neutral-content;
		background-color: hsl(var(--b2) / var(--tw-bg-opacity)) !important;
	}

	:global([data-svelte-search] input) {
		border-color: hsl(var(--s)) !important;
		background-color: hsl(var(--b1) / var(--tw-bg-opacity)) !important;
		border-radius: var(--rounded-btn, 0.5rem) !important;
	}
</style>
