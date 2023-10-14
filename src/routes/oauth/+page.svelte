<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	Hello oauth. Got these:
	<ul>
		<li>Status: {data.status}</li>
		<li>Status Text: {data.statusTest}</li>
		<li>JSON: {JSON.stringify(data.res)}</li>
	</ul>
</div>
