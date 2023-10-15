<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>
<div>
    Hello. Your id is: {data.id}. Your data is: {JSON.stringify(data.profile)}
</div>