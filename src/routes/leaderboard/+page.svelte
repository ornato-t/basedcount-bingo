<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main>
	<h1 class="font-bold">Leaderboard</h1>
	{#each data.leaderboard as player}
		<p>
			{player.place})
			{player.name}: {player.victories}
			[{player.rounds.join(' ')}]
		</p>
	{/each}

	<br />

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
</main>
