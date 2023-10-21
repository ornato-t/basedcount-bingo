<script lang="ts">
	import type { PageData } from './$types';
	import BingoBoard from './bingoBoard.svelte';
	import CloseRoundModal from './closeRoundModal.svelte';

	export let data: PageData;
</script>

<main class="grid gap-y-8">
	<section>
		<h1 class="text-3xl font-semibold mb-4">Your card</h1>
		<BingoBoard cards={data.cards} token={data.token ?? ''}/>
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

			<!-- svelte-ignore missing-declaration -->
			<button
				class="btn btn-secondary btn-lg mt-4"
				on:click={() => {
					// @ts-ignore
					closeRound.showModal();
				}}>Start a new round</button
			>
		</section>
	{/if}
</main>

<CloseRoundModal token={data.token ?? ''} users={data.users}/>
