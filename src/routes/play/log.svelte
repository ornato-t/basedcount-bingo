<script lang="ts">
	import type { Log } from './proxy+page.server';

	export let entries: Log[];

	console.log(entries)
</script>

<aside>
	{#each entries as log}
		<div>
			{log.type}
		</div>
	{/each}
</aside>
