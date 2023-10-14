<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	Hello oauth. Got these:
	<ul>
		<li>Servers: {JSON.stringify(data.servers)}</li>
		<li>Profile in BC server: {JSON.stringify(data.serverProfile)}</li>
	</ul>
</div>
