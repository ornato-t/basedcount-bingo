<script lang="ts">
	import type { PageData } from './$types';
	import Player from './player.svelte';

	export let data: PageData;
</script>

<main class="-mb-2">
	<h1 class="text-xl mx-auto w-fit font-semibold my-2">Leaderboard</h1>
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
					<tr class="">
						<th>
							{#if player.place === 1}
								🥇
							{:else if player.place === 2}
								🥈
							{:else if player.place === 3}
								🥉
							{:else}
								{player.place}
							{/if}
						</th>
						<td> <Player {player} className={"my-1"} /></td>
						<td>{player.victories}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- <br />

	<h1 class="font-bold">Rounds</h1>
	{#each data.rounds as round}
		<p>
			{round.round_number} [
			{#each round.winners as winner}
				{winner.name + ' '}
			{/each}
			]
		</p>
	{/each} -->
</main>
