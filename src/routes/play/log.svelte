<script lang="ts">
	import type { Log } from './proxy+page.server';

	export let entries: Log[];
</script>

<aside>
	{#each entries as log}
		<div>
			{log.type}
		</div>
	{/each}
</aside>
