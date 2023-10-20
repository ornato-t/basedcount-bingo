<script lang="ts">
	import { fit, parent_style } from '@leveluptuts/svelte-fit';
	import type { PageData } from './$types';
	import Typehead from 'svelte-typeahead';
	import type { DiscordMember } from './+page.server';

	export let data: PageData;

	const extract = (entry: DiscordMember) => entry.name;

	const added: typeof data.added = []; //This is a hack to cards from non players. It sucks, I'm aware
	for (const user of data.added) {
		if (user.name === null && user.image === null) {
			const match = data.userList.find((el) => el.discord_id === user.discord_id);
			added.push({
				discord_id: user.discord_id,
				image: match?.image ?? 'null',
				name: match?.name ?? '',
				text: user.text
			});
		} else {
			added.push(user);
		}
	}

	let discord_id: string | null;
</script>

<main>
	<div class="w-full grid place-items-center mb-4">
		<a class="btn btn-secondary w-full md:w-96" href="/play">
			<i class="bx bx-left-arrow-alt" />
			Back to your card
		</a>
	</div>

	<form method="POST" class="card md:w-96 bg-neutral shadow-xl mx-auto">
		<div class="card-body">
			<h2 class="text-xl">Add a new card</h2>
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

	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-6 place-items-center md:mx-4 mt-12">
		<h2 class="col-span-full text-xl">Cards added by you</h2>
		{#each added as card}
			<div>
				{#if card.name}
					<div class="flex items-center">
						<div class="avatar">
							<div class="h-6 rounded-full">
								<img src={card.image} alt="{card.name}'s avatar" />
							</div>
						</div>
						<span class="ml-2">
							{card.name}
						</span>
					</div>
				{/if}
				<div class="w-36 h-36 md:w-40 md:h-40 rounded-2xl p-2 bg-neutral">
					<div style="position: relative; {parent_style}">
						<h1 use:fit>{card.text}</h1>
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
