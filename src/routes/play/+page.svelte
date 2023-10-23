<script lang="ts">
	import type { PageData } from './$types';
	import BingoBoard from './bingoBoard.svelte';
	import CloseRoundModal from './closeRoundModal.svelte';
	import Log from './log.svelte';

	export let data: PageData;
</script>

<main class="grid grid-cols-4 gap-y-8">
	<section>
		<div class="card card-compact w-full bg-base-100 shadow-xl image-full">
			<figure><img src={data.currentUser?.banner} alt="" /></figure>
			<div class="card-body flex flex-row">
				{#if data.currentUser}
					<img src={data.currentUser?.image} alt="" class="rounded-lg row-span-4 h-full" />
					<span class="grid grid-rows-3 grid-cols-3 w-full">
						<h2 class="card-title row-span-1 col-span-2">
							{data.currentUser?.name ?? ''}
						</h2>
						<a href="/logout" class="btn btn-square btn-error btn-outline btn-sm justify-self-end">
							<i class="bx bx-log-out text-lg" />
						</a>
						<p class="col-span-full">
							{data.currentUser?.admin ? 'Admin' : 'Player'}
						</p>
						<p class="col-span-full">
							{data.currentUser?.victories}
							{data.currentUser.victories === 1 ? 'victory' : 'victories'}
						</p>
					</span>
				{/if}
			</div>
		</div>

		<span class="flex flex-col gap-3 mt-3">
			<a href="/play/add" class="btn btn-secondary"> Add a card </a>

			{#if data.currentUser !== null && data.currentUser.admin}
				<!-- svelte-ignore missing-declaration -->
				<button
					class="btn btn-secondary col-span-2"
					on:click={() => {
						// @ts-ignore
						closeRound.showModal();
					}}
				>
					Start a new round
				</button>
			{/if}
		</span>
	</section>

	<BingoBoard cards={data.cards} token={data.token ?? ''} className={'col-span-2'} />

	<Log entries={data.log} />
</main>

<CloseRoundModal token={data.token ?? ''} users={data.users} />
