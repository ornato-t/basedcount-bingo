<script lang="ts">
	import type { PageData } from './$types';
	import Player from './player.svelte';

	export let data: PageData;

	let ldbOrRound: boolean;
</script>

<main class="-mb-2">
	<label class="text-xl mx-auto w-fit font-semibold my-2 flex flex-row items-center gap-x-3 cursor-pointer" for="ldb-or-round">
		<span class={ldbOrRound ? 'opacity-25' : ''}> Leaderboard </span>

		<label class="swap swap-flip text-4xl">
			<input id="ldb-or-round" type="checkbox" bind:checked={ldbOrRound} />

			<i class="bx bx-history swap-on" />
			<i class="bx bx-trophy swap-off" />
		</label>

		<span class={!ldbOrRound ? 'opacity-25' : ''}> Round recap </span>
	</label>

	{#if !ldbOrRound}
		<div class="overflow-x-auto w-2/3 md:mx-auto">
			<table class="table table-lg">
				<thead>
					<tr>
						<th>Position</th>
						<th>Username</th>
						<th>Victories</th>
					</tr>
				</thead>
				<tbody>
					{#each data.leaderboard as player, i}
						<tr>
							<th>
								{#if player.place === 1}
									🥇
								{:else if player.place === 2}
									🥈
								{:else if player.place === 3}
									🥉
								{:else}
									<span class="ml-1.5">
										{player.place}
									</span>
								{/if}
							</th>
							<td> <Player {player} className={'my-1'} /></td>
							<td>{player.victories}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div>
			<h1 class="font-bold">Rounds</h1>
			{#each data.rounds as round}
				<p>
					{round.round_number} [
					{#each round.winners as winner}
						{winner.name + ' '}
					{/each}
					]
				</p>
			{/each}
		</div>
	{/if}
</main>
