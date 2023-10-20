<script lang="ts">
	import type { PageData } from './$types';
	import { fit, parent_style } from '@leveluptuts/svelte-fit';

	export let data: PageData;
</script>

<main class="grid gap-y-8">
	<section>
		<h1 class="text-3xl font-semibold mb-4">Your card</h1>
		<div class="grid grid-cols-5 w-fit mx-auto rounded-lg border-2 border-secondary bg-neutral-focus select-none">
			{#each data.cards as card}
				<div class="w-16 h-16 sm:w-28 sm:h-28 border border-secondary p-1.5">
					<div style="position: relative; {parent_style}">
						<h1 use:fit>{card.text}</h1>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h1 class="text-3xl font-semibold">Your profile</h1>
		<div class="card card-compact w-80 bg-base-100 shadow-xl image-full">
			<figure><img src={data.currentUser?.banner} alt="" /></figure>
			<div class="card-body grid grid-rows-4 grid-cols-2">
				{#if data.currentUser}
					<img src={data.currentUser?.image} alt="" class="rounded-lg row-span-4 h-full" />
					<h2 class="card-title row-span-2">{data.currentUser?.name ?? ''}</h2>
					<p>
						{#if data.currentUser?.admin}Admin{/if}
					</p>
					<p>{data.currentUser?.victories} {data.currentUser.victories === 1 ? 'victory' : 'victories'}</p>
				{/if}
			</div>
		</div>

		<a href="/play/add" class="btn btn-secondary btn-lg mt-4"> Add a card </a>
	</section>

	{#if data.currentUser !== null && data.currentUser.admin}
		<section>
			<h1 class="text-3xl font-semibold">Admin control panel</h1>
			<div class="" />

			<button class="btn btn-secondary btn-lg mt-4"> Do admin stuff </button>
		</section>
	{/if}
</main>
