<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data);
</script>

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
