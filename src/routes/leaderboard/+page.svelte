<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main>
	{#each data.leaderboard as player}
		<p>
			{player.place}
			{player.name}: {player.victories}
			{player.rounds}
		</p>
	{/each}

	<br />

	{#each data.rounds as round}
		<p>
			{round.round_number}
			<li>
				{#each round.winners as winner}
					<ul>
						{winner.name}
					</ul>
				{/each}
			</li>
		</p>
	{/each}
</main>
