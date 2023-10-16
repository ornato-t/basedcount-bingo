<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main>
	<form method="POST">
		<label>
			Text
			<input name="text" type="text" />
		</label>
		<label>
			Target
			<input name="target" type="text" />
		</label>
		<input name="token" type="hidden" value={data.token} />
		<button type="submit">Submit card</button>
	</form>
	<div class="grid grid-cols-3 gap-4">
		<span class="col-span-full"> Cards added by you: </span>
		{#each data.added as card}
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
